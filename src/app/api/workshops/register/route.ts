import { NextResponse } from "next/server";
import {
  getWorkshopById,
  markRegistrationEmail,
  registerParticipant,
} from "@/lib/workshops/service";
import { firstZodMessage, registrationInputSchema } from "@/lib/workshops/validation";
import {
  sanitizeEmail,
  sanitizeMultiline,
  sanitizePhone,
  sanitizeText,
} from "@/lib/workshops/sanitize";
import { getClientIp, rateLimit } from "@/lib/workshops/rate-limit";
import { getWorkshopStatus } from "@/lib/workshops/status";
import { DuplicateRegistrationError } from "@/lib/workshops/errors";
import { sendEmail } from "@/lib/email";
import { buildRegistrationConfirmationEmail } from "@/lib/email/templates/registration-confirmation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toBool(value: unknown): boolean {
  return value === true || value === "true" || value === "on" || value === "1";
}

/** POST /api/workshops/register — public participant registration. */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ error: "Μη έγκυρα δεδομένα." }, { status: 400 });
    }

    // Honeypot: bots fill hidden fields. Pretend success, store nothing.
    if (typeof body.company === "string" && body.company.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    // Rate limit per IP.
    const ip = getClientIp(request);
    const limit = rateLimit(`ws-register:${ip}`, 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Πάρα πολλές προσπάθειες. Δοκίμασε ξανά σε λίγο." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    // Sanitise, then validate.
    const candidate = {
      workshopId: sanitizeText(body.workshopId, 64),
      firstName: sanitizeText(body.firstName, 80),
      lastName: sanitizeText(body.lastName, 80),
      email: sanitizeEmail(body.email),
      phone: sanitizePhone(body.phone),
      comment: sanitizeMultiline(body.comment, 1000),
      consentGiven: toBool(body.consentGiven),
    };

    const parsed = registrationInputSchema.safeParse(candidate);
    if (!parsed.success) {
      return NextResponse.json({ error: firstZodMessage(parsed.error) }, { status: 400 });
    }
    const data = parsed.data;

    // Workshop must exist, be active, and not be over.
    const workshop = await getWorkshopById(data.workshopId);
    if (!workshop) {
      return NextResponse.json({ error: "Το workshop δεν βρέθηκε." }, { status: 404 });
    }
    if (!workshop.active) {
      return NextResponse.json(
        { error: "Οι εγγραφές για αυτό το workshop δεν είναι διαθέσιμες." },
        { status: 400 }
      );
    }
    if (getWorkshopStatus(workshop) === "completed") {
      return NextResponse.json(
        { error: "Το workshop έχει ολοκληρωθεί." },
        { status: 400 }
      );
    }

    // Persist registration (duplicate email → 409).
    let registration;
    try {
      registration = await registerParticipant({
        workshopId: data.workshopId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        comment: data.comment,
        consentGiven: data.consentGiven,
      });
    } catch (err) {
      if (err instanceof DuplicateRegistrationError) {
        return NextResponse.json({ error: err.message, code: "duplicate" }, { status: 409 });
      }
      throw err;
    }

    // Confirmation email — best effort; never blocks a successful registration.
    const locale = body.locale === "en" ? "en" : "el";
    try {
      const message = buildRegistrationConfirmationEmail({
        workshop,
        firstName: data.firstName,
        email: data.email,
        locale,
      });
      const result = await sendEmail(message);
      const status = result.ok ? (result.skipped ? "skipped" : "sent") : "failed";
      await markRegistrationEmail(
        registration.id,
        status,
        result.ok && !result.skipped ? new Date().toISOString() : undefined
      );
    } catch (emailErr) {
      console.error("[register] confirmation email failed", emailErr);
      await markRegistrationEmail(registration.id, "failed").catch(() => undefined);
    }

    return NextResponse.json({ ok: true, id: registration.id, slug: workshop.slug });
  } catch (err) {
    console.error("[POST /api/workshops/register]", err);
    return NextResponse.json(
      { error: "Αποτυχία εγγραφής. Δοκίμασε ξανά." },
      { status: 500 }
    );
  }
}
