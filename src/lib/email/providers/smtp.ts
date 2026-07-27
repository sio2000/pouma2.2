/**
 * SMTP provider — delivers via nodemailer. Configure with:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS  (+ optional SMTP_SECURE=true)
 *   EMAIL_FROM — sender address
 *
 * nodemailer is an OPTIONAL peer: it is loaded lazily through an indirect
 * import so the bundler never tries to resolve it at build time. Install it
 * (`npm i nodemailer`) only if you choose the SMTP backend; otherwise this
 * provider stays dormant and the system uses Resend or the console fallback.
 */

import type { EmailMessage, EmailProvider, EmailSendResult } from "@/lib/email/types";
import { getDefaultFrom } from "@/lib/email/from";

// Indirect dynamic import — hidden from static bundler analysis on purpose so
// the build never tries to resolve the optional `nodemailer` dependency.
const lazyImport = new Function("specifier", "return import(specifier);") as (
  specifier: string
) => Promise<unknown>;

interface NodemailerTransport {
  sendMail(options: Record<string, unknown>): Promise<{ messageId?: string }>;
}
interface NodemailerModule {
  createTransport(options: Record<string, unknown>): NodemailerTransport;
}

function smtpConfig() {
  return {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    secure: process.env.SMTP_SECURE === "true",
  };
}

export const smtpProvider: EmailProvider = {
  name: "smtp",

  isConfigured() {
    const { host, user, pass } = smtpConfig();
    return Boolean(host && user && pass);
  },

  async send(message: EmailMessage): Promise<EmailSendResult> {
    const { host, port, user, pass, secure } = smtpConfig();
    if (!host || !user || !pass) {
      return { ok: false, provider: "smtp", error: "SMTP credentials missing" };
    }

    let nodemailer: NodemailerModule;
    try {
      const mod = (await lazyImport("nodemailer")) as
        | NodemailerModule
        | { default: NodemailerModule };
      nodemailer = "createTransport" in mod ? mod : mod.default;
    } catch {
      return {
        ok: false,
        provider: "smtp",
        error:
          "nodemailer is not installed. Run `npm i nodemailer` to enable the SMTP backend.",
      };
    }

    try {
      const transport = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
      const info = await transport.sendMail({
        from: getDefaultFrom(),
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
        replyTo: message.replyTo,
      });
      return { ok: true, provider: "smtp", id: info.messageId };
    } catch (err) {
      return {
        ok: false,
        provider: "smtp",
        error: err instanceof Error ? err.message : "SMTP send failed",
      };
    }
  },
};
