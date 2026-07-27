/**
 * Input sanitisation / XSS hardening for user-supplied text.
 *
 * All stored values are treated as plain text. Rendering uses React's default
 * escaping (never dangerouslySetInnerHTML), so this is defence-in-depth: we
 * strip control characters and any angle-bracket markup before persistence.
 *
 * Control characters are removed via a code-point filter rather than a regex,
 * which keeps the source clean and avoids ESLint's `no-control-regex` rule.
 */

const HTML_TAGS = /<[^>]*>/g;
const TAB = 0x09;
const LF = 0x0a;

function isControl(code: number): boolean {
  // C0 controls (0x00–0x1F), DEL (0x7F) and C1 controls (0x80–0x9F).
  return code <= 0x1f || (code >= 0x7f && code <= 0x9f);
}

function stripControlChars(input: string, keepBreaks: boolean): string {
  let out = "";
  for (const ch of input) {
    const code = ch.codePointAt(0) ?? 0;
    if (isControl(code)) {
      if (keepBreaks && (code === TAB || code === LF)) out += ch;
      continue;
    }
    out += ch;
  }
  return out;
}

/** Collapse a single-line field: strip tags, control chars, trim, clamp length. */
export function sanitizeText(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return stripControlChars(value.replace(HTML_TAGS, ""), false)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/** Multi-line variant — keeps newlines (collapses runs to max two). */
export function sanitizeMultiline(value: unknown, maxLength = 8000): string {
  if (typeof value !== "string") return "";
  const withoutTags = value.replace(HTML_TAGS, "").replace(/\r\n/g, "\n");
  return stripControlChars(withoutTags, true)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(value: unknown): string {
  if (typeof value !== "string") return "";
  return stripControlChars(value, false).trim().toLowerCase().slice(0, 254);
}

export function sanitizePhone(value: unknown): string {
  if (typeof value !== "string") return "";
  // Keep digits, spaces and the common phone punctuation only.
  return value
    .replace(/[^\d+()\-\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 32);
}
