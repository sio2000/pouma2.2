/**
 * Resend provider — calls the Resend REST API directly via fetch (no SDK
 * dependency). Configure with:
 *   RESEND_API_KEY  — your Resend API key
 *   EMAIL_FROM      — verified sender, e.g. "The Pouma Academy <hello@domain>"
 */

import type { EmailMessage, EmailProvider, EmailSendResult } from "@/lib/email/types";
import { getDefaultFrom } from "@/lib/email/from";

const ENDPOINT = "https://api.resend.com/emails";

export const resendProvider: EmailProvider = {
  name: "resend",

  isConfigured() {
    return Boolean(process.env.RESEND_API_KEY);
  },

  async send(message: EmailMessage): Promise<EmailSendResult> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return { ok: false, provider: "resend", error: "RESEND_API_KEY missing" };
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: getDefaultFrom(),
          to: [message.to],
          subject: message.subject,
          html: message.html,
          text: message.text,
          reply_to: message.replyTo,
        }),
      });

      const payload = (await res.json().catch(() => ({}))) as {
        id?: string;
        message?: string;
        name?: string;
      };

      if (!res.ok) {
        return {
          ok: false,
          provider: "resend",
          error: payload.message || `Resend error ${res.status}`,
        };
      }

      return { ok: true, provider: "resend", id: payload.id };
    } catch (err) {
      return {
        ok: false,
        provider: "resend",
        error: err instanceof Error ? err.message : "Resend request failed",
      };
    }
  },
};
