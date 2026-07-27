import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getResourceById, updateResource } from "@/lib/db/file-store";
import { saveResourceFile, deleteResourceFile } from "@/lib/db/upload-resource-file";
import { normalizeResourceType, RESOURCE_TYPES } from "@/lib/resource-types";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const isAdmin = await isAdminAuthenticated();
  const resource = await getResourceById(id, isAdmin);

  if (!resource) {
    return NextResponse.json({ error: "Δεν βρέθηκε το υλικό." }, { status: 404 });
  }

  return NextResponse.json(resource);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Μη εξουσιοδοτημένο." }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await getResourceById(id, true);
  if (!existing) {
    return NextResponse.json({ error: "Δεν βρέθηκε το υλικό." }, { status: 404 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const title = String(formData.get("title") ?? "");
      const description = String(formData.get("description") ?? "");
      const type = normalizeResourceType(String(formData.get("type") ?? existing.type));
      const urlRaw = String(formData.get("url") ?? "");
      const file = formData.get("file");
      const removeFile = formData.get("removeFile") === "1";

      if (!title.trim() || !description.trim()) {
        return NextResponse.json({ error: "Απαιτούνται τίτλος και περιγραφή." }, { status: 400 });
      }

      if (!RESOURCE_TYPES.includes(type)) {
        return NextResponse.json({ error: "Μη έγκυρη κατηγορία." }, { status: 400 });
      }

      let fileUrl = existing.fileUrl;
      let thumbnailUrl = existing.thumbnailUrl;

      if (removeFile) {
        await deleteResourceFile(existing.fileUrl, existing.thumbnailUrl);
        fileUrl = undefined;
        thumbnailUrl = undefined;
      }

      if (file instanceof File && file.size > 0) {
        await deleteResourceFile(existing.fileUrl, existing.thumbnailUrl);
        const saved = await saveResourceFile(file, id);
        fileUrl = saved.fileUrl;
        thumbnailUrl = saved.thumbnailUrl;
      }

      const updated = await updateResource(id, {
        title,
        description,
        type,
        url: urlRaw.trim() || undefined,
        fileUrl: fileUrl ?? null,
        thumbnailUrl: thumbnailUrl ?? null,
      });

      return NextResponse.json(updated);
    }

    const body = await request.json();
    const type = body.type ? normalizeResourceType(String(body.type)) : existing.type;

    if (!RESOURCE_TYPES.includes(type)) {
      return NextResponse.json({ error: "Μη έγκυρη κατηγορία." }, { status: 400 });
    }

    const updated = await updateResource(id, {
      title: body.title !== undefined ? String(body.title) : undefined,
      description: body.description !== undefined ? String(body.description) : undefined,
      type,
      url: body.url !== undefined ? (body.url ? String(body.url) : null) : undefined,
      published: body.published,
    });

    if (!updated) {
      return NextResponse.json({ error: "Δεν βρέθηκε το υλικό." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Αποτυχία ενημέρωσης υλικού.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
