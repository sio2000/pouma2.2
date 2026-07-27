/**
 * Email entry point. Selects a provider (explicit via EMAIL_PROVIDER, else
 * auto-detected from credentials) and exposes a single `sendEmail`.
 *
 * Provider precedence when EMAIL_PROVIDER is unset:
 *   Resend (if RESEND_API_KEY)  →  SMTP (if SMTP_* )  →  console fallback.
 */

import type { EmailMessage, EmailProvider, EmailSendResult } from "@/lib/email/types";
import { consoleProvider } from "@/lib/email/providers/console";
import { resendProvider } from "@/lib/email/providers/resend";
import { smtpProvider } from "@/lib/email/providers/smtp";

export function getEmailProvider(): EmailProvider {
  const explicit = (process.env.EMAIL_PROVIDER || "").trim().toLowerCase();

  if (explicit === "resend") return resendProvider;
  if (explicit === "smtp") return smtpProvider;
  if (explicit === "console" || explicit === "none") return consoleProvider;

  if (resendProvider.isConfigured()) return resendProvider;
  if (smtpProvider.isConfigured()) return smtpProvider;
  return consoleProvider;
}

export async function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
  try {
    return await getEmailProvider().send(message);
  } catch (err) {
    return {
      ok: false,
      provider: getEmailProvider().name,
      error: err instanceof Error ? err.message : "Email send failed",
    };
  }
}

export type { EmailMessage, EmailProvider, EmailSendResult };
