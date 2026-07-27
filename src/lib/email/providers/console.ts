/**
 * Console provider — the default when no real email service is configured.
 * It logs the message (so the flow is observable in dev) and reports the send
 * as "skipped" so callers can record an honest status.
 */

import type { EmailMessage, EmailProvider, EmailSendResult } from "@/lib/email/types";

export const consoleProvider: EmailProvider = {
  name: "console",

  isConfigured() {
    return true;
  },

  async send(message: EmailMessage): Promise<EmailSendResult> {
    console.info(
      `[email:console] (not delivered — no provider configured)\n` +
        `  to:      ${message.to}\n` +
        `  subject: ${message.subject}`
    );
    return { ok: true, provider: "console", skipped: true };
  },
};
