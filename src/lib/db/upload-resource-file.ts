import { promises as fs } from "fs";
import path from "path";
import { UPLOAD_API_PREFIX } from "@/lib/upload-url";
import { filenameFromUploadUrl } from "@/lib/db/upload-storage";
import { useNetlifyBlobs } from "@/lib/db/runtime-env";
import { deleteUploadFromBlob, MAX_BLOB_UPLOAD_BYTES, writeUploadToBlob } from "@/lib/db/upload-blob";

function getLocalUploadDir() {
  return path.join(process.cwd(), "public", "uploads", "resources");
}

function getTmpUploadDir() {
  return path.join("/tmp", "pouma-uploads");
}

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 15 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function buildFileUrl(filename: string): string {
  return `${UPLOAD_API_PREFIX}${filename}`;
}

export async function saveResourceFile(
  file: File,
  resourceId: string
): Promise<{ fileUrl: string; thumbnailUrl?: string }> {
  if (file.size > MAX_BYTES) {
    throw new Error("Το αρχείο υπερβαίνει το όριο 15MB.");
  }

  const mime = file.type || "application/octet-stream";
  if (!ALLOWED_MIME.has(mime)) {
    throw new Error("Μη υποστηριζόμενος τύπος αρχείου. Επιτρέπονται PDF και εικόνες.");
  }

  const extFromMime = EXT_BY_MIME[mime];
  const extFromName = path.extname(file.name);
  const ext = extFromMime ? extFromMime : extFromName ? extFromName : ".bin";
  const filename = `${resourceId}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileUrl = buildFileUrl(filename);
  const thumbnailUrl = mime.startsWith("image/") ? fileUrl : undefined;

  if (useNetlifyBlobs()) {
    if (buffer.length > MAX_BLOB_UPLOAD_BYTES) {
      throw new Error(
        `Στο production το μέγιστο μέγεθος αρχείου είναι ${Math.round(MAX_BLOB_UPLOAD_BYTES / (1024 * 1024))}MB.`
      );
    }
    await writeUploadToBlob(filename, buffer, mime);
    return { fileUrl, thumbnailUrl };
  }

  const uploadDir = getLocalUploadDir();
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  return {
    fileUrl: `/uploads/resources/${filename}`,
    thumbnailUrl,
  };
}

export async function deleteResourceFile(fileUrl?: string, thumbnailUrl?: string): Promise<void> {
  const urls = new Set([fileUrl, thumbnailUrl].filter(Boolean) as string[]);

  for (const url of urls) {
    const name = filenameFromUploadUrl(url);
    if (!name) continue;

    if (url.startsWith(UPLOAD_API_PREFIX)) {
      if (useNetlifyBlobs()) {
        await deleteUploadFromBlob(url);
      }
      await fs.unlink(path.join(getTmpUploadDir(), name)).catch(() => undefined);
      continue;
    }

    if (url.startsWith("/uploads/resources/")) {
      await fs.unlink(path.join(process.cwd(), "public", url)).catch(() => undefined);
    }
  }
}
