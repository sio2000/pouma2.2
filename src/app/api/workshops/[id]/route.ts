import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { deleteResourceFile, saveResourceFile } from "@/lib/db/upload-resource-file";
import { deleteWorkshop, getWorkshopById, updateWorkshop } from "@/lib/workshops/service";
import { firstZodMessage, workshopInputSchema } from "@/lib/workshops/validation";
import type { WorkshopUpdateInput } from "@/lib/workshops/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readString(value: FormDataEntryValue | null): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  return value === "true" || value === "on" || value === "1";
}

/** PATCH /api/workshops/:id — admin update (multipart with banner, or JSON). */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Μη εξουσιοδοτημένο." }, { status: 401 });
  }

  const { id } = await params;
  const current = await getWorkshopById(id);
  if (!current) {
    return NextResponse.json({ error: "Το workshop δεν βρέθηκε." }, { status: 404 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    let raw: Record<string, unknown>;
    let newBannerUrl: string | undefined;
    let removeBanner = false;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const durationRaw = readString(form.get("durationMinutes"));

      raw = {
        title: readString(form.get("title")),
        subtitle: readString(form.get("subtitle")),
        description: readString(form.get("description")),
        slug: readString(form.get("slug")),
        date: readString(form.get("date")),
        time: readString(form.get("time")),
        durationMinutes:
          durationRaw && durationRaw.trim() !== "" ? Number(durationRaw) : undefined,
        active: parseBoolean(readString(form.get("active"))),
      };

      removeBanner = readString(form.get("removeBanner")) === "1";
      const file = form.get("banner");
      if (file instanceof File && file.size > 0) {
        const saved = await saveResourceFile(file, crypto.randomUUID());
        newBannerUrl = saved.fileUrl;
      }
    } else {
      raw = (await request.json()) as Record<string, unknown>;
      removeBanner = raw.removeBanner === true || raw.removeBanner === "1";
    }

    // Drop keys that weren't provided so partial validation stays clean.
    for (const key of Object.keys(raw)) {
      if (raw[key] === undefined) delete raw[key];
    }

    const parsed = workshopInputSchema.partial().safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: firstZodMessage(parsed.error) }, { status: 400 });
    }

    const input: WorkshopUpdateInput = { ...parsed.data };
    if (newBannerUrl) input.bannerUrl = newBannerUrl;
    else if (removeBanner) input.bannerUrl = null;
    else delete input.bannerUrl;

    const updated = await updateWorkshop(id, input);
    if (!updated) {
      return NextResponse.json({ error: "Το workshop δεν βρέθηκε." }, { status: 404 });
    }

    // Remove the previous banner file once a replacement/removal succeeded.
    if (
      (newBannerUrl || removeBanner) &&
      current.bannerUrl &&
      current.bannerUrl !== updated.bannerUrl
    ) {
      await deleteResourceFile(current.bannerUrl);
    }

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Αποτυχία ενημέρωσης workshop.";
    console.error("[PATCH /api/workshops/:id]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** DELETE /api/workshops/:id — admin delete (cascades registrations). */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Μη εξουσιοδοτημένο." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const deleted = await deleteWorkshop(id);
    if (!deleted) {
      return NextResponse.json({ error: "Το workshop δεν βρέθηκε." }, { status: 404 });
    }
    if (deleted.bannerUrl) {
      await deleteResourceFile(deleted.bannerUrl);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/workshops/:id]", err);
    return NextResponse.json({ error: "Αποτυχία διαγραφής workshop." }, { status: 500 });
  }
}
