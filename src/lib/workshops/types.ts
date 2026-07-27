/**
 * Workshop Marketing System — domain types.
 *
 * App code uses camelCase. The Supabase store maps these to/from the
 * snake_case columns defined in supabase/migrations/0001_*.sql.
 */

export type WorkshopStatus = "upcoming" | "live" | "completed";

export type RegistrationEmailStatus = "pending" | "sent" | "failed" | "skipped";

/** A workshop exactly as persisted. */
export interface Workshop {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  bannerUrl?: string;
  slug: string;
  /** YYYY-MM-DD, interpreted in Europe/Athens. */
  date: string;
  /** HH:mm, interpreted in Europe/Athens. */
  time: string;
  durationMinutes: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * A workshop enriched with computed scheduling fields, safe to hand to client
 * components and to serialise into JSON responses. `startsAt`/`endsAt` are
 * absolute ISO timestamps so the browser never has to reason about timezones.
 */
export interface WorkshopView extends Workshop {
  status: WorkshopStatus;
  startsAt: string;
  endsAt: string;
}

/** A single participant registration exactly as persisted. */
export interface WorkshopRegistration {
  id: string;
  workshopId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comment?: string;
  consentGiven: boolean;
  consentAt?: string;
  emailStatus: RegistrationEmailStatus;
  emailSentAt?: string;
  createdAt: string;
}

/** Fields accepted when creating a workshop (admin). */
export interface WorkshopCreateInput {
  title: string;
  subtitle?: string;
  description?: string;
  bannerUrl?: string;
  slug: string;
  date: string;
  time: string;
  durationMinutes?: number;
  active?: boolean;
}

/** Fields accepted when updating a workshop (admin). All optional. */
export interface WorkshopUpdateInput {
  title?: string;
  subtitle?: string | null;
  description?: string;
  bannerUrl?: string | null;
  slug?: string;
  date?: string;
  time?: string;
  durationMinutes?: number;
  active?: boolean;
}

/** Fields accepted when creating a registration (public form). */
export interface RegistrationCreateInput {
  workshopId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comment?: string;
  consentGiven: boolean;
}
