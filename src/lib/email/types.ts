/** Email provider abstraction shared by all backends (Resend, SMTP, console). */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface EmailSendResult {
  ok: boolean;
  provider: string;
  /** Provider message id when available. */
  id?: string;
  /** True when no real delivery happened (no provider configured). */
  skipped?: boolean;
  error?: string;
}

export interface EmailProvider {
  readonly name: string;
  /** Whether this provider has the credentials it needs to deliver mail. */
  isConfigured(): boolean;
  send(message: EmailMessage): Promise<EmailSendResult>;
}
