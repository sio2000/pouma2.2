/**
 * Supabase store — production Postgres backend. Active only when the Supabase
 * env vars are configured (see supabase-client.ts). Maps the app's camelCase
 * domain types to/from the snake_case columns in migration 0001.
 */

import { getSupabaseAdmin } from "@/lib/workshops/store/supabase-client";
import { DuplicateRegistrationError } from "@/lib/workshops/errors";
import { DEFAULT_DURATION_MINUTES } from "@/lib/workshops/status";
import type {
  RegistrationCreateInput,
  RegistrationEmailStatus,
  Workshop,
  WorkshopCreateInput,
  WorkshopRegistration,
  WorkshopUpdateInput,
} from "@/lib/workshops/types";
import type { WorkshopStore } from "@/lib/workshops/store/store-interface";
import type { SupabaseClient } from "@supabase/supabase-js";

const WORKSHOPS = "workshops";
const REGISTRATIONS = "workshop_registrations";

interface WorkshopRow {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  banner_url: string | null;
  slug: string;
  date: string;
  time: string;
  duration_minutes: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface RegistrationRow {
  id: string;
  workshop_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  comment: string | null;
  consent_given: boolean;
  consent_at: string | null;
  email_status: RegistrationEmailStatus;
  email_sent_at: string | null;
  created_at: string;
}

function client(): SupabaseClient {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error("Supabase is not configured but the Supabase store was used.");
  }
  return admin;
}

function mapWorkshop(row: WorkshopRow): Workshop {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    description: row.description ?? "",
    bannerUrl: row.banner_url ?? undefined,
    slug: row.slug,
    date: row.date,
    time: row.time,
    durationMinutes: row.duration_minutes ?? DEFAULT_DURATION_MINUTES,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRegistration(row: RegistrationRow): WorkshopRegistration {
  return {
    id: row.id,
    workshopId: row.workshop_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    comment: row.comment ?? undefined,
    consentGiven: row.consent_given,
    consentAt: row.consent_at ?? undefined,
    emailStatus: row.email_status,
    emailSentAt: row.email_sent_at ?? undefined,
    createdAt: row.created_at,
  };
}

function isUniqueViolation(error: { code?: string } | null): boolean {
  return error?.code === "23505";
}

export const supabaseStore: WorkshopStore = {
  backend: "supabase",

  async listWorkshops() {
    const { data, error } = await client()
      .from(WORKSHOPS)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data as WorkshopRow[]).map(mapWorkshop);
  },

  async getWorkshopById(id) {
    const { data, error } = await client()
      .from(WORKSHOPS)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapWorkshop(data as WorkshopRow) : null;
  },

  async getWorkshopBySlug(slug) {
    const { data, error } = await client()
      .from(WORKSHOPS)
      .select("*")
      .eq("slug", slug.toLowerCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapWorkshop(data as WorkshopRow) : null;
  },

  async createWorkshop(input: WorkshopCreateInput) {
    const { data, error } = await client()
      .from(WORKSHOPS)
      .insert({
        title: input.title,
        subtitle: input.subtitle ?? null,
        description: input.description ?? "",
        banner_url: input.bannerUrl ?? null,
        slug: input.slug,
        date: input.date,
        time: input.time,
        duration_minutes: input.durationMinutes ?? DEFAULT_DURATION_MINUTES,
        active: input.active ?? true,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapWorkshop(data as WorkshopRow);
  },

  async updateWorkshop(id, input: WorkshopUpdateInput) {
    const patch: Record<string, unknown> = {};
    if (input.title !== undefined) patch.title = input.title;
    if (input.subtitle !== undefined) patch.subtitle = input.subtitle;
    if (input.description !== undefined) patch.description = input.description;
    if (input.bannerUrl !== undefined) patch.banner_url = input.bannerUrl;
    if (input.slug !== undefined) patch.slug = input.slug;
    if (input.date !== undefined) patch.date = input.date;
    if (input.time !== undefined) patch.time = input.time;
    if (input.durationMinutes !== undefined) patch.duration_minutes = input.durationMinutes;
    if (input.active !== undefined) patch.active = input.active;

    if (Object.keys(patch).length === 0) {
      return this.getWorkshopById(id);
    }

    const { data, error } = await client()
      .from(WORKSHOPS)
      .update(patch)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapWorkshop(data as WorkshopRow) : null;
  },

  async deleteWorkshop(id) {
    // FK cascade removes registrations automatically.
    const { data, error } = await client()
      .from(WORKSHOPS)
      .delete()
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapWorkshop(data as WorkshopRow) : null;
  },

  async listRegistrations(workshopId) {
    const { data, error } = await client()
      .from(REGISTRATIONS)
      .select("*")
      .eq("workshop_id", workshopId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data as RegistrationRow[]).map(mapRegistration);
  },

  async countRegistrations(workshopId) {
    const { count, error } = await client()
      .from(REGISTRATIONS)
      .select("id", { count: "exact", head: true })
      .eq("workshop_id", workshopId);
    if (error) throw new Error(error.message);
    return count ?? 0;
  },

  async createRegistration(input: RegistrationCreateInput) {
    const now = new Date().toISOString();
    const { data, error } = await client()
      .from(REGISTRATIONS)
      .insert({
        workshop_id: input.workshopId,
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        comment: input.comment ?? null,
        consent_given: input.consentGiven,
        consent_at: input.consentGiven ? now : null,
        email_status: "pending",
      })
      .select("*")
      .single();

    if (error) {
      if (isUniqueViolation(error)) throw new DuplicateRegistrationError();
      throw new Error(error.message);
    }
    return mapRegistration(data as RegistrationRow);
  },

  async updateRegistrationEmailStatus(
    id,
    status: RegistrationEmailStatus,
    sentAt?: string
  ) {
    const patch: Record<string, unknown> = { email_status: status };
    if (sentAt) patch.email_sent_at = sentAt;
    const { error } = await client().from(REGISTRATIONS).update(patch).eq("id", id);
    if (error) throw new Error(error.message);
  },
};
