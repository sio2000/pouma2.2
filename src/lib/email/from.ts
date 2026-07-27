import { siteConfig } from "@/lib/seo";

/** Verified sender address. Override with EMAIL_FROM in production. */
export function getDefaultFrom(): string {
  return process.env.EMAIL_FROM || `The Pouma Academy <${siteConfig.email}>`;
}

/** Reply-to address shown to participants. */
export function getReplyTo(): string {
  return process.env.EMAIL_REPLY_TO || siteConfig.email;
}
