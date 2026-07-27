/**
 * Registration confirmation email.
 *
 * IMPORTANT: this only confirms the registration. It deliberately does NOT
 * contain the workshop access link — per spec, the admin sends that manually,
 * in a second email, before the event.
 */

import type { EmailMessage } from "@/lib/email/types";
import { getReplyTo } from "@/lib/email/from";
import { siteConfig } from "@/lib/seo";
import { formatWorkshopDate, formatWorkshopTime } from "@/lib/workshops/status";
import type { Workshop } from "@/lib/workshops/types";

interface ConfirmationParams {
  workshop: Workshop;
  firstName: string;
  email: string;
  locale: string;
}

const COPY = {
  el: {
    subject: "Επιβεβαίωση Συμμετοχής στο Workshop",
    preheader: "Η συμμετοχή σου καταχωρήθηκε επιτυχώς.",
    badge: "Επιβεβαίωση Συμμετοχής",
    greeting: (name: string) => `Γεια σου ${name},`,
    confirmed: "Η συμμετοχή σου στο workshop καταχωρήθηκε επιτυχώς. Σε ευχαριστούμε θερμά!",
    detailsTitle: "Στοιχεία workshop",
    dateLabel: "Ημερομηνία",
    timeLabel: "Ώρα",
    next:
      "Πριν την έναρξη του workshop θα λάβεις ένα δεύτερο email με τον σύνδεσμο παρακολούθησης. Κράτησε αυτό το email για την επιβεβαίωσή σου.",
    help: "Αν έχεις οποιαδήποτε απορία, απάντησε απλώς σε αυτό το email.",
    signature: "Με εκτίμηση,\nThe Pouma Academy",
    footer: "Έλαβες αυτό το email επειδή δήλωσες συμμετοχή σε workshop της The Pouma Academy.",
  },
  en: {
    subject: "Workshop Registration Confirmation",
    preheader: "Your registration was successful.",
    badge: "Registration Confirmed",
    greeting: (name: string) => `Hi ${name},`,
    confirmed: "Your workshop registration was successful. Thank you so much!",
    detailsTitle: "Workshop details",
    dateLabel: "Date",
    timeLabel: "Time",
    next:
      "Before the workshop starts, you will receive a second email with the access link. Please keep this email as your confirmation.",
    help: "If you have any questions, just reply to this email.",
    signature: "Warm regards,\nThe Pouma Academy",
    footer: "You received this email because you registered for a The Pouma Academy workshop.",
  },
} as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildRegistrationConfirmationEmail({
  workshop,
  firstName,
  email,
  locale,
}: ConfirmationParams): EmailMessage {
  const lang = locale === "en" ? "en" : "el";
  const t = COPY[lang];
  const name = firstName.trim() || (lang === "el" ? "φίλε/η" : "there");
  const dateText = formatWorkshopDate(workshop, lang);
  const timeText = formatWorkshopTime(workshop, lang);

  const text = [
    t.greeting(name),
    "",
    t.confirmed,
    "",
    `${t.detailsTitle}:`,
    `• ${workshop.title}`,
    `• ${t.dateLabel}: ${dateText}`,
    `• ${t.timeLabel}: ${timeText}`,
    "",
    t.next,
    "",
    t.help,
    "",
    t.signature,
  ].join("\n");

  const html = `<!doctype html>
<html lang="${lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(t.subject)}</title></head>
<body style="margin:0;padding:0;background:#FDFBF8;font-family:Helvetica,Arial,sans-serif;color:#2E1F52;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(t.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FDFBF8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #F3EBFF;border-radius:24px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#6F44C4,#8656DC);padding:32px 36px;">
          <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);font-weight:bold;">${escapeHtml(t.badge)}</div>
          <div style="font-size:22px;color:#ffffff;font-weight:bold;margin-top:6px;">The Pouma Academy</div>
        </td></tr>
        <tr><td style="padding:36px;">
          <p style="font-size:16px;margin:0 0 16px;">${escapeHtml(t.greeting(name))}</p>
          <p style="font-size:15px;line-height:1.7;color:#524080;margin:0 0 24px;">${escapeHtml(t.confirmed)}</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6FF;border:1px solid #F3EBFF;border-radius:16px;padding:20px 24px;margin:0 0 24px;">
            <tr><td>
              <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8656DC;font-weight:bold;margin-bottom:12px;">${escapeHtml(t.detailsTitle)}</div>
              <div style="font-size:17px;font-weight:bold;color:#2E1F52;margin-bottom:10px;">${escapeHtml(workshop.title)}</div>
              <div style="font-size:14px;color:#524080;">📅 ${escapeHtml(t.dateLabel)}: <strong>${escapeHtml(dateText)}</strong></div>
              <div style="font-size:14px;color:#524080;margin-top:4px;">🕒 ${escapeHtml(t.timeLabel)}: <strong>${escapeHtml(timeText)}</strong></div>
            </td></tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF2CC;border:1px solid #FFD978;border-radius:16px;padding:18px 22px;margin:0 0 24px;">
            <tr><td style="font-size:14px;line-height:1.7;color:#7a5a12;">⭐ ${escapeHtml(t.next)}</td></tr>
          </table>

          <p style="font-size:14px;line-height:1.7;color:#524080;margin:0 0 24px;">${escapeHtml(t.help)}</p>
          <p style="font-size:14px;line-height:1.7;color:#2E1F52;margin:0;white-space:pre-line;">${escapeHtml(t.signature)}</p>
        </td></tr>
        <tr><td style="padding:20px 36px;border-top:1px solid #F3EBFF;background:#FAF6FF;">
          <p style="font-size:12px;line-height:1.6;color:#9b8bbf;margin:0;">${escapeHtml(t.footer)}</p>
          <p style="font-size:12px;color:#b8a8d8;margin:6px 0 0;">${escapeHtml(siteConfig.url)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return {
    to: email,
    subject: t.subject,
    html,
    text,
    replyTo: getReplyTo(),
  };
}
