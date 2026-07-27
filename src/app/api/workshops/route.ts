import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { saveResourceFile } from "@/lib/db/upload-resource-file";
import {
  createWorkshop,
  getActiveUpcomingWorkshops,
  getFeaturedWorkshop,
  listWorkshopsWithCounts,
} from "@/lib/workshops/service";
import { workshopInputSchema, firstZodMessage } from "@/lib/workshops/validation";
import type { WorkshopCreateInput } from "@/lib/workshops/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/workshops
 *   ?scope=featured → nearest upcoming active workshop (public)
 *   ?scope=all      → every workshop with registration counts (admin)
 *   (default)       → active upcoming workshops (public)
 */
export async function GET(request: Request) {
  try {
    const scope = new URL(request.url).searchParams.get("scope") ?? "public";

    if (scope === "featured") {
      const featured = await getFeaturedWorkshop();
      return NextResponse.json({ workshop: featured });
    }

    if (scope === "all") {
      if (!(await isAdminAuthenticated())) {
        return NextResponse.json({ error: "Μη εξουσιοδοτημένο." }, { status: 401 });
      }
      return NextResponse.json(await listWorkshopsWithCounts());
    }

    return NextResponse.json(await getActiveUpcomingWorkshops());
  } catch (err) {
    console.error("[GET /api/workshops]", err);
    return NextResponse.json({ error: "Αποτυχία φόρτωσης workshops." }, { status: 500 });
  }
}

function readString(value: FormDataEntryValue | null): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  return value === "true" || value === "on" || value === "1";
}

/** POST /api/workshops — admin create (multipart with optional banner, or JSON). */
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Μη εξουσιοδοτημένο." }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    let raw: Record<string, unknown>;
    let bannerFromFile: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const durationRaw = readString(form.get("durationMinutes"));

      raw = {
        title: readString(form.get("title")) ?? "",
        subtitle: readString(form.get("subtitle")),
        description: readString(form.get("description")),
        slug: readString(form.get("slug")),
        date: readString(form.get("date")) ?? "",
        time: readString(form.get("time")) ?? "",
        durationMinutes:
          durationRaw && durationRaw.trim() !== "" ? Number(durationRaw) : undefined,
        active: parseBoolean(readString(form.get("active"))),
      };

      const file = form.get("banner");
      if (file instanceof File && file.size > 0) {
        const saved = await saveResourceFile(file, crypto.randomUUID());
        bannerFromFile = saved.fileUrl;
      }
    } else {
      raw = (await request.json()) as Record<string, unknown>;
    }

    const parsed = workshopInputSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: firstZodMessage(parsed.error) }, { status: 400 });
    }

    const data = parsed.data;
    const input: WorkshopCreateInput = {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description ?? "",
      bannerUrl: bannerFromFile ?? data.bannerUrl,
      slug: data.slug,
      date: data.date,
      time: data.time,
      durationMinutes: data.durationMinutes,
      active: data.active,
    };

    const created = await createWorkshop(input);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Αποτυχία δημιουργίας workshop.";
    console.error("[POST /api/workshops]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
