/**
 * Zod schemas — the single source of truth for server-side validation of
 * workshop and registration payloads.
 *
 * Callers normalise transport-specific values (FormData strings → number/
 * boolean, honeypot handling) BEFORE validating, so these schemas stay strict
 * and predictable.
 */

import { z } from "zod";
import { isValidSlug, slugify } from "@/lib/workshops/slug";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
// Permissive international phone: digits, spaces and + ( ) - , min 7 digits.
const PHONE_RE = /^[+()\-\s]*(?:\d[()\-\s]*){7,}$/;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));

export const workshopInputSchema = z.object({
  title: z.string().trim().min(2, "Ο τίτλος είναι πολύ σύντομος.").max(160),
  subtitle: optionalText(220),
  description: optionalText(8000),
  bannerUrl: optionalText(1000),
  slug: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => (value ? slugify(value) : ""))
    .refine((value) => value === "" || isValidSlug(value), {
      message: "Μη έγκυρο slug.",
    }),
  date: z.string().regex(DATE_RE, "Μη έγκυρη ημερομηνία (YYYY-MM-DD)."),
  time: z.string().regex(TIME_RE, "Μη έγκυρη ώρα (HH:mm)."),
  durationMinutes: z
    .number()
    .int()
    .min(15, "Ελάχιστη διάρκεια 15 λεπτά.")
    .max(1440)
    .optional(),
  active: z.boolean().optional(),
});

export type WorkshopInput = z.infer<typeof workshopInputSchema>;

export const registrationInputSchema = z.object({
  workshopId: z.string().trim().min(1, "Λείπει το workshop."),
  firstName: z.string().trim().min(2, "Συμπλήρωσε το όνομά σου.").max(80),
  lastName: z.string().trim().min(2, "Συμπλήρωσε το επώνυμό σου.").max(80),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Συμπλήρωσε το email σου.")
    .max(254)
    .email("Μη έγκυρο email."),
  phone: z
    .string()
    .trim()
    .min(7, "Συμπλήρωσε ένα έγκυρο τηλέφωνο.")
    .max(32)
    .regex(PHONE_RE, "Μη έγκυρος αριθμός τηλεφώνου."),
  comment: optionalText(1000),
  consentGiven: z.boolean().refine((value) => value === true, {
    message: "Απαιτείται η συναίνεση επεξεργασίας δεδομένων.",
  }),
});

export type RegistrationInput = z.infer<typeof registrationInputSchema>;

/** Flatten Zod issues to a single human-readable message (Greek). */
export function firstZodMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Μη έγκυρα δεδομένα.";
}
