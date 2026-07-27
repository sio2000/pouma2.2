/**
 * Blobs store — the project's native JSON-document backend (Netlify Blobs in
 * production, local disk in dev). This is the zero-config default so the whole
 * workshop system runs out of the box without any external service.
 *
 * Read-modify-write mirrors the existing resources/contacts store. Duplicate
 * protection is best-effort here; the Supabase backend enforces it with a real
 * unique index.
 */

import { readJsonFile, writeJsonFile } from "@/lib/db/json-storage";
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

const WORKSHOPS_FILE = "workshops.json";
const REGISTRATIONS_FILE = "workshop-registrations.json";

function readWorkshops(): Promise<Workshop[]> {
  return readJsonFile<Workshop[]>(WORKSHOPS_FILE, []);
}

function readRegistrations(): Promise<WorkshopRegistration[]> {
  return readJsonFile<WorkshopRegistration[]>(REGISTRATIONS_FILE, []);
}

const byNewest = (a: { createdAt: string }, b: { createdAt: string }) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export const blobsStore: WorkshopStore = {
  backend: "blobs",

  async listWorkshops() {
    const all = await readWorkshops();
    return all.slice().sort(byNewest);
  },

  async getWorkshopById(id) {
    const all = await readWorkshops();
    return all.find((w) => w.id === id) ?? null;
  },

  async getWorkshopBySlug(slug) {
    const target = slug.toLowerCase();
    const all = await readWorkshops();
    return all.find((w) => w.slug.toLowerCase() === target) ?? null;
  },

  async createWorkshop(input: WorkshopCreateInput) {
    const all = await readWorkshops();
    const now = new Date().toISOString();
    const workshop: Workshop = {
      id: crypto.randomUUID(),
      title: input.title,
      subtitle: input.subtitle,
      description: input.description ?? "",
      bannerUrl: input.bannerUrl,
      slug: input.slug,
      date: input.date,
      time: input.time,
      durationMinutes: input.durationMinutes ?? DEFAULT_DURATION_MINUTES,
      active: input.active ?? true,
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(workshop);
    await writeJsonFile(WORKSHOPS_FILE, all);
    return workshop;
  },

  async updateWorkshop(id, input: WorkshopUpdateInput) {
    const all = await readWorkshops();
    const index = all.findIndex((w) => w.id === id);
    if (index === -1) return null;

    const current = all[index];
    const updated: Workshop = {
      ...current,
      title: input.title ?? current.title,
      subtitle:
        input.subtitle === undefined ? current.subtitle : input.subtitle ?? undefined,
      description: input.description ?? current.description,
      bannerUrl:
        input.bannerUrl === undefined ? current.bannerUrl : input.bannerUrl ?? undefined,
      slug: input.slug ?? current.slug,
      date: input.date ?? current.date,
      time: input.time ?? current.time,
      durationMinutes: input.durationMinutes ?? current.durationMinutes,
      active: input.active ?? current.active,
      updatedAt: new Date().toISOString(),
    };
    all[index] = updated;
    await writeJsonFile(WORKSHOPS_FILE, all);
    return updated;
  },

  async deleteWorkshop(id) {
    const all = await readWorkshops();
    const target = all.find((w) => w.id === id);
    if (!target) return null;

    await writeJsonFile(
      WORKSHOPS_FILE,
      all.filter((w) => w.id !== id)
    );

    // Cascade: drop this workshop's registrations.
    const regs = await readRegistrations();
    const remaining = regs.filter((r) => r.workshopId !== id);
    if (remaining.length !== regs.length) {
      await writeJsonFile(REGISTRATIONS_FILE, remaining);
    }

    return target;
  },

  async listRegistrations(workshopId) {
    const regs = await readRegistrations();
    return regs.filter((r) => r.workshopId === workshopId).sort(byNewest);
  },

  async countRegistrations(workshopId) {
    const regs = await readRegistrations();
    return regs.reduce((n, r) => (r.workshopId === workshopId ? n + 1 : n), 0);
  },

  async createRegistration(input: RegistrationCreateInput) {
    const regs = await readRegistrations();
    const email = input.email.toLowerCase();

    const duplicate = regs.some(
      (r) => r.workshopId === input.workshopId && r.email.toLowerCase() === email
    );
    if (duplicate) throw new DuplicateRegistrationError();

    const now = new Date().toISOString();
    const registration: WorkshopRegistration = {
      id: crypto.randomUUID(),
      workshopId: input.workshopId,
      firstName: input.firstName,
      lastName: input.lastName,
      email,
      phone: input.phone,
      comment: input.comment,
      consentGiven: input.consentGiven,
      consentAt: input.consentGiven ? now : undefined,
      emailStatus: "pending",
      createdAt: now,
    };
    regs.unshift(registration);
    await writeJsonFile(REGISTRATIONS_FILE, regs);
    return registration;
  },

  async updateRegistrationEmailStatus(
    id,
    status: RegistrationEmailStatus,
    sentAt?: string
  ) {
    const regs = await readRegistrations();
    const index = regs.findIndex((r) => r.id === id);
    if (index === -1) return;
    regs[index] = {
      ...regs[index],
      emailStatus: status,
      emailSentAt: sentAt ?? regs[index].emailSentAt,
    };
    await writeJsonFile(REGISTRATIONS_FILE, regs);
  },
};
