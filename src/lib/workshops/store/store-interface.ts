/**
 * Storage contract for the workshop system. Two interchangeable
 * implementations satisfy it:
 *   - supabase-store : production database (Postgres) when env is configured
 *   - blobs-store    : the project's native JSON/Netlify-Blobs store (default)
 *
 * Implementations own persistence only. Business rules (status, featured
 * selection, slug uniqueness, email orchestration) live in service.ts.
 */

import type {
  RegistrationCreateInput,
  RegistrationEmailStatus,
  Workshop,
  WorkshopCreateInput,
  WorkshopRegistration,
  WorkshopUpdateInput,
} from "@/lib/workshops/types";

export interface WorkshopStore {
  /** Name of the active backend — surfaced in health/debug output. */
  readonly backend: "supabase" | "blobs";

  listWorkshops(): Promise<Workshop[]>;
  getWorkshopById(id: string): Promise<Workshop | null>;
  getWorkshopBySlug(slug: string): Promise<Workshop | null>;
  createWorkshop(input: WorkshopCreateInput): Promise<Workshop>;
  updateWorkshop(id: string, input: WorkshopUpdateInput): Promise<Workshop | null>;
  /** Removes the workshop (and cascades registrations); returns the deleted row. */
  deleteWorkshop(id: string): Promise<Workshop | null>;

  listRegistrations(workshopId: string): Promise<WorkshopRegistration[]>;
  countRegistrations(workshopId: string): Promise<number>;
  /** Throws DuplicateRegistrationError when (workshop, email) already exists. */
  createRegistration(input: RegistrationCreateInput): Promise<WorkshopRegistration>;
  updateRegistrationEmailStatus(
    id: string,
    status: RegistrationEmailStatus,
    sentAt?: string
  ): Promise<void>;
}
