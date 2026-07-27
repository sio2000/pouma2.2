import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { addResource, deleteResource, getResources } from "@/lib/db/file-store";
import { saveResourceFile } from "@/lib/db/upload-resource-file";
import type { ResourceType } from "@/lib/db/types";
import { normalizeResourceType, RESOURCE_TYPES } from "@/lib/resource-types";
import { randomUUID } from "crypto";

const VALID_TYPES: ResourceType[] = RESOURCE_TYPES;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "1" && (await isAdminAuthenticated());
    const resources = await getResources(all);
    return NextResponse.json(resources);
  } catch (err) {
    console.error("[GET /api/resources]", err);
    return NextResponse.json({ error: "Αποτυχία φόρτωσης υλικού." }, { status: 500 });
  }
}

async function createResource(input: {
  id?: string;
  title: string;
  description: string;
  type: ResourceType;
  url?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  published?: boolean;
}) {
  if (!input.title?.trim() || !input.description?.trim()) {
    return NextResponse.json({ error: "Απαιτούνται τίτλος και περιγραφή." }, { status: 400 });
  }

  if (!VALID_TYPES.includes(input.type)) {
    return NextResponse.json({ error: "Μη έγκυρη κατηγορία." }, { status: 400 });
  }

  const resource = await addResource({
    id: input.id,
    title: input.title,
    description: input.description,
    type: input.type,
    url: input.url,
    fileUrl: input.fileUrl,
    thumbnailUrl: input.thumbnailUrl,
    published: input.published !== false,
  });

  return NextResponse.json(resource);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Μη εξουσιοδοτημένο." }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const title = String(formData.get("title") ?? "");
      const description = String(formData.get("description") ?? "");
      const type = normalizeResourceType(String(formData.get("type") ?? ""));
      const url = String(formData.get("url") ?? "").trim() || undefined;
      const file = formData.get("file");

      const resourceId = randomUUID();
      let fileUrl: string | undefined;
      let thumbnailUrl: string | undefined;

      if (file instanceof File && file.size > 0) {
        const saved = await saveResourceFile(file, resourceId);
        fileUrl = saved.fileUrl;
        thumbnailUrl = saved.thumbnailUrl;
      }

      return createResource({
        id: resourceId,
        title,
        description,
        type,
        url,
        fileUrl,
        thumbnailUrl,
      });
    }

    const body = await request.json();
    const { title, description, type, url, fileUrl, thumbnailUrl, published } = body;

    return createResource({
      title: String(title),
      description: String(description),
      type: normalizeResourceType(String(type)),
      url: url ? String(url) : undefined,
      fileUrl: fileUrl ? String(fileUrl) : undefined,
      thumbnailUrl: thumbnailUrl ? String(thumbnailUrl) : undefined,
      published,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Αποτυχία δημιουργίας υλικού.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Μη εξουσιοδοτημένο." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Λείπει το id." }, { status: 400 });
  }

  const deleted = await deleteResource(id);
  if (!deleted) {
    return NextResponse.json({ error: "Δεν βρέθηκε το υλικό." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
