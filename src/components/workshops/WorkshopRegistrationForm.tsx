"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PremiumButton from "@/components/ui/PremiumButton";
import { apiFetch } from "@/lib/api-client";
import { EASE_LUXURY } from "@/lib/motion";
import {
  REGISTERED_FLAG,
  registeredFlagFor,
} from "@/components/workshops/popup-storage";
import type { WorkshopContent } from "@/lib/workshops/content";

interface Props {
  workshopId: string;
  slug: string;
  locale: string;
  content: WorkshopContent;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-\s]*(?:\d[()\-\s]*){7,}$/;

type FieldErrors = Partial<Record<"firstName" | "lastName" | "email" | "phone" | "consent", boolean>>;

export default function WorkshopRegistrationForm({ workshopId, slug, locale, content }: Props) {
  const router = useRouter();
  const r = content.register;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    comment: "",
    company: "", // honeypot
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (form.firstName.trim().length < 2) next.firstName = true;
    if (form.lastName.trim().length < 2) next.lastName = true;
    if (!EMAIL_RE.test(form.email.trim())) next.email = true;
    if (!PHONE_RE.test(form.phone.trim())) next.phone = true;
    if (!consent) next.consent = true;
    setErrors(next);
    if (next.consent && Object.keys(next).length === 1) {
      setFormError(r.errorConsent);
    }
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await apiFetch("/api/workshops/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopId,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          comment: form.comment,
          company: form.company,
          consentGiven: consent,
          locale,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        try {
          localStorage.setItem(REGISTERED_FLAG, "1");
          localStorage.setItem(registeredFlagFor(workshopId), "1");
        } catch {
          // localStorage may be unavailable — non-fatal.
        }
        router.push(`/${locale}/workshop/${slug}/thank-you`);
        return;
      }

      if (res.status === 409) {
        setErrors({ email: true });
        setFormError(r.errorDuplicate);
      } else {
        setFormError(data.error || r.errorGeneric);
      }
    } catch {
      setFormError(r.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (key: keyof FieldErrors) =>
    `input-premium ${errors[key] ? "!border-red-400 !ring-2 !ring-red-200" : ""}`;

  const labelClass = "block text-[11px] font-bold text-plum/35 uppercase tracking-[0.2em] mb-2";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.7, ease: EASE_LUXURY }}
      className="bg-white rounded-3xl border border-lav-100/80 p-6 sm:p-8 md:p-10 shadow-medium"
      noValidate
    >
      <p className="text-[11px] font-bold text-plum/30 uppercase tracking-[0.2em] mb-1">
        {r.eyebrow}
      </p>
      <h3 className="font-display text-2xl sm:text-3xl text-plum mb-1">{r.title}</h3>
      <p className="text-body-premium text-sm mb-6">{r.text}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="ws-firstName">
            {r.firstName} *
          </label>
          <input
            id="ws-firstName"
            type="text"
            autoComplete="given-name"
            required
            value={form.firstName}
            onChange={update("firstName")}
            className={fieldClass("firstName")}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="ws-lastName">
            {r.lastName} *
          </label>
          <input
            id="ws-lastName"
            type="text"
            autoComplete="family-name"
            required
            value={form.lastName}
            onChange={update("lastName")}
            className={fieldClass("lastName")}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="ws-email">
            {r.email} *
          </label>
          <input
            id="ws-email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={update("email")}
            className={fieldClass("email")}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="ws-phone">
            {r.phone} *
          </label>
          <input
            id="ws-phone"
            type="tel"
            autoComplete="tel"
            required
            value={form.phone}
            onChange={update("phone")}
            className={fieldClass("phone")}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="ws-comment">
            {r.comment} <span className="lowercase tracking-normal text-plum/25">({r.optional})</span>
          </label>
          <textarea
            id="ws-comment"
            rows={3}
            value={form.comment}
            onChange={update("comment")}
            className="input-premium resize-none"
          />
        </div>
      </div>

      {/* Honeypot — hidden from humans, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden" >
        <label htmlFor="ws-company">Company</label>
        <input
          id="ws-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={update("company")}
        />
      </div>

      <label className="flex items-start gap-3 mt-6 cursor-pointer group">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (e.target.checked) setErrors((prev) => ({ ...prev, consent: false }));
          }}
          className={`mt-1 h-4 w-4 flex-shrink-0 rounded border-lav-300 text-lav-600 focus:ring-lav-400/40 cursor-pointer ${
            errors.consent ? "outline outline-2 outline-red-400 rounded" : ""
          }`}
        />
        <span className={`text-xs leading-relaxed ${errors.consent ? "text-red-500" : "text-plum/55"}`}>
          {(() => {
            const idx = r.consent.indexOf(r.consentLinkText);
            if (idx === -1) return r.consent;
            return (
              <>
                {r.consent.slice(0, idx)}
                <Link
                  href={`/${locale}/privacy`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium text-lav-600 underline decoration-gold-400/60 underline-offset-2 hover:text-lav-700 hover:decoration-gold-500"
                >
                  {r.consentLinkText}
                </Link>
                {r.consent.slice(idx + r.consentLinkText.length)}
              </>
            );
          })()}
        </span>
      </label>

      {formError && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {formError}
        </p>
      )}

      <div className="mt-7">
        <PremiumButton type="submit" variant="gold" size="lg" disabled={loading} className="w-full">
          {loading ? r.submitting : r.submit}
        </PremiumButton>
      </div>
    </motion.form>
  );
}
