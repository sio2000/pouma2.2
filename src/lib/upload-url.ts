export const UPLOAD_API_PREFIX = "/api/uploads/resources/";

/** Normalize stored paths (API, public folder, or legacy bare filename). */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith(UPLOAD_API_PREFIX)) {
    return trimmed;
  }

  if (trimmed.startsWith("/uploads/resources/")) {
    return trimmed;
  }

  if (!trimmed.includes("/") && /\.[a-z0-9]+$/i.test(trimmed)) {
    return `${UPLOAD_API_PREFIX}${trimmed}`;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/** User-uploaded files must bypass Next image optimizer (API route). */
export function isUploadMediaUrl(src: string): boolean {
  return (
    src.startsWith(UPLOAD_API_PREFIX) ||
    src.startsWith("/uploads/resources/") ||
    src.includes("/api/uploads/resources/")
  );
}
