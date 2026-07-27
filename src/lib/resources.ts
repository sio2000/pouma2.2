import type { Resource } from "@/lib/db/types";
import { resolveMediaUrl } from "@/lib/upload-url";
import { normalizeExternalUrl, displayHostname } from "@/lib/url";

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i;
const PDF_EXT = /\.pdf$/i;

/** Internal blog-style article page */
export function getResourceReadPath(locale: string, id: string): string {
  return `/${locale}/resources/${id}`;
}

export function getExternalArticleUrl(r: Resource): string | null {
  if (!r.url?.trim()) return null;
  return normalizeExternalUrl(r.url);
}

export function getExternalLinkLabel(r: Resource): string | null {
  if (!r.url?.trim()) return null;
  return displayHostname(r.url);
}

export function getFileUrl(r: Resource): string | null {
  return resolveMediaUrl(r.fileUrl);
}

export function isImageResource(r: Resource): boolean {
  if (r.thumbnailUrl) return true;
  const target = r.fileUrl ?? "";
  return IMAGE_EXT.test(target);
}

export function isPdfResource(r: Resource): boolean {
  const target = r.fileUrl ?? "";
  return PDF_EXT.test(target) || r.type === "pdf";
}

export function getThumbnailSrc(r: Resource): string | null {
  const fromThumb = resolveMediaUrl(r.thumbnailUrl);
  if (fromThumb) return fromThumb;

  if (r.fileUrl && IMAGE_EXT.test(r.fileUrl)) {
    return resolveMediaUrl(r.fileUrl);
  }

  return null;
}

export { isUploadMediaUrl, resolveMediaUrl } from "@/lib/upload-url";
