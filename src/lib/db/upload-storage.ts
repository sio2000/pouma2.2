import { UPLOAD_API_PREFIX } from "@/lib/upload-url";
import { getBlobStore } from "@/lib/db/netlify-store";
import { useNetlifyBlobs } from "@/lib/db/runtime-env";
import path from "path";

export function getTmpUploadDir() {
  return path.join("/tmp", "pouma-uploads");
}

/** Blob key inside pouma-data (same store as resources.json) */
export function uploadKeyFromFilename(filename: string) {
  return `uploads/${filename}`;
}

/** Legacy key in separate pouma-uploads store */
export function legacyUploadKeyFromFilename(filename: string) {
  return `resources/${filename}`;
}

export function filenameFromUploadUrl(url?: string) {
  if (!url) return null;
  if (url.startsWith(UPLOAD_API_PREFIX)) {
    return url.slice(UPLOAD_API_PREFIX.length);
  }
  if (url.startsWith("/uploads/resources/")) {
    return url.slice("/uploads/resources/".length);
  }
  return null;
}

export async function getUploadStore() {
  return getBlobStore("pouma-data");
}

export async function getLegacyUploadStore() {
  return getBlobStore("pouma-uploads");
}

export function isBlobUploadUrl(url?: string) {
  return Boolean(url?.startsWith(UPLOAD_API_PREFIX));
}

export { useNetlifyBlobs, UPLOAD_API_PREFIX };
