/**
 * Export helpers (client-safe — no server imports). Used by the admin to
 * export participant emails as CSV and to copy them to the clipboard.
 */

import type { WorkshopRegistration } from "@/lib/workshops/types";

/** Quote a CSV cell only when it contains a delimiter, quote or newline. */
function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Unique, lower-cased emails preserving first-seen order. */
export function uniqueEmails(registrations: WorkshopRegistration[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of registrations) {
    const email = r.email.trim().toLowerCase();
    if (email && !seen.has(email)) {
      seen.add(email);
      out.push(email);
    }
  }
  return out;
}

/** Spec format: a single `email` column, one address per line. */
export function buildEmailsCsv(registrations: WorkshopRegistration[]): string {
  const rows = ["email", ...uniqueEmails(registrations).map(csvCell)];
  return rows.join("\r\n");
}

/** One email per line — for the "Copy Emails" button. */
export function buildEmailsList(registrations: WorkshopRegistration[]): string {
  return uniqueEmails(registrations).join("\n");
}

/** Full participant export (convenience): name, email, phone, date. */
export function buildParticipantsCsv(registrations: WorkshopRegistration[]): string {
  const header = ["first_name", "last_name", "email", "phone", "registered_at"];
  const rows = registrations.map((r) =>
    [
      r.firstName,
      r.lastName,
      r.email,
      r.phone,
      new Date(r.createdAt).toISOString(),
    ]
      .map((cell) => csvCell(String(cell ?? "")))
      .join(",")
  );
  return [header.join(","), ...rows].join("\r\n");
}

/** Safe filename fragment from a workshop slug/title. */
export function exportFilename(base: string, suffix: string): string {
  const safe = base.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
  return `${safe || "workshop"}-${suffix}`;
}
