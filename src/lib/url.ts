/** Ensures external links open correctly (e.g. devtaskhub.com → https://devtaskhub.com). */
export function normalizeExternalUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function displayHostname(url: string): string {
  try {
    return new URL(normalizeExternalUrl(url)).hostname.replace(/^www\./, "");
  } catch {
    return url.trim();
  }
}
