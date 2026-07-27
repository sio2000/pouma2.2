/**
 * Workshop service — business logic on top of the storage layer. API routes
 * and server components call these; they never touch a store directly.
 */

import { getWorkshopStore } from "@/lib/workshops/store";
import { ensureUniqueSlug, slugify } from "@/lib/workshops/slug";
import { byStartAsc, getWorkshopStatus, toWorkshopView } from "@/lib/workshops/status";
import type {
  RegistrationCreateInput,
  RegistrationEmailStatus,
  Workshop,
  WorkshopCreateInput,
  WorkshopRegistration,
  WorkshopUpdateInput,
  WorkshopView,
} from "@/lib/workshops/types";

export interface WorkshopWithCount extends WorkshopView {
  registrationCount: number;
}

/** All workshops (any status), newest first — for the admin list. */
export async function listWorkshopsWithCounts(
  now: Date = new Date()
): Promise<WorkshopWithCount[]> {
  const store = getWorkshopStore();
  const all = await store.listWorkshops();
  const counts = await Promise.all(all.map((w) => store.countRegistrations(w.id)));
  return all.map((workshop, i) => ({
    ...toWorkshopView(workshop, now),
    registrationCount: counts[i],
  }));
}

/** Active + upcoming, soonest first — public listings & popup source. */
export async function getActiveUpcomingWorkshops(
  now: Date = new Date()
): Promise<WorkshopView[]> {
  const all = await getWorkshopStore().listWorkshops();
  return all
    .filter((w) => w.active && getWorkshopStatus(w, now) === "upcoming")
    .sort(byStartAsc)
    .map((w) => toWorkshopView(w, now));
}

/** The single nearest upcoming active workshop, or null. Drives the popup. */
export async function getFeaturedWorkshop(
  now: Date = new Date()
): Promise<WorkshopView | null> {
  const upcoming = await getActiveUpcomingWorkshops(now);
  return upcoming[0] ?? null;
}

export async function getWorkshopViewBySlug(
  slug: string,
  now: Date = new Date()
): Promise<WorkshopView | null> {
  const workshop = await getWorkshopStore().getWorkshopBySlug(slug);
  return workshop ? toWorkshopView(workshop, now) : null;
}

export async function getWorkshopById(id: string): Promise<Workshop | null> {
  return getWorkshopStore().getWorkshopById(id);
}

/** Create a workshop, guaranteeing a unique slug derived from slug|title. */
export async function createWorkshop(input: WorkshopCreateInput): Promise<Workshop> {
  const store = getWorkshopStore();
  const existing = await store.listWorkshops();
  const taken = existing.map((w) => w.slug.toLowerCase());
  const desired = input.slug ? slugify(input.slug) : slugify(input.title);
  const slug = ensureUniqueSlug(desired, taken);
  return store.createWorkshop({ ...input, slug });
}

/** Update a workshop; re-derives a unique slug when one is supplied. */
export async function updateWorkshop(
  id: string,
  input: WorkshopUpdateInput
): Promise<Workshop | null> {
  const store = getWorkshopStore();
  const next: WorkshopUpdateInput = { ...input };

  if (input.slug !== undefined) {
    const desired = slugify(input.slug ?? "");
    if (desired) {
      const existing = await store.listWorkshops();
      const taken = existing
        .filter((w) => w.id !== id)
        .map((w) => w.slug.toLowerCase());
      next.slug = ensureUniqueSlug(desired, taken);
    } else {
      delete next.slug; // never clear a slug
    }
  }

  return store.updateWorkshop(id, next);
}

/** Delete a workshop (cascades registrations); returns the removed row. */
export async function deleteWorkshop(id: string): Promise<Workshop | null> {
  return getWorkshopStore().deleteWorkshop(id);
}

export async function listRegistrations(
  workshopId: string
): Promise<WorkshopRegistration[]> {
  return getWorkshopStore().listRegistrations(workshopId);
}

export async function registerParticipant(
  input: RegistrationCreateInput
): Promise<WorkshopRegistration> {
  return getWorkshopStore().createRegistration(input);
}

export async function markRegistrationEmail(
  id: string,
  status: RegistrationEmailStatus,
  sentAt?: string
): Promise<void> {
  return getWorkshopStore().updateRegistrationEmailStatus(id, status, sentAt);
}

/** Which backend is serving requests — used by the admin/debug surface. */
export function activeBackend(): "supabase" | "blobs" {
  return getWorkshopStore().backend;
}
