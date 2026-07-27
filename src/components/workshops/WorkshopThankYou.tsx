"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getWorkshopContent } from "@/lib/workshops/content";
import { formatWorkshopDate, formatWorkshopTime } from "@/lib/workshops/status";
import { EASE_LUXURY } from "@/lib/motion";
import type { WorkshopView } from "@/lib/workshops/types";

interface Props {
  workshop: WorkshopView | null;
  locale: string;
}

function googleCalendarUrl(workshop: WorkshopView): string {
  const fmt = (iso: string) =>
    new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: workshop.title,
    dates: `${fmt(workshop.startsAt)}/${fmt(workshop.endsAt)}`,
    details: workshop.subtitle || workshop.title,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function WorkshopThankYou({ workshop, locale }: Props) {
  const content = getWorkshopContent(locale);
  const t = content.thankYou;

  return (
    <div className="min-h-screen bg-hero-canvas flex items-center justify-center px-4 sm:px-6 py-28 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className="w-full max-w-lg bg-white rounded-3xl border border-lav-100 shadow-strong p-8 sm:p-10 md:p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center mx-auto mb-7 shadow-gold-glow"
        >
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <p className="text-eyebrow text-lav-600 mb-3">{t.badge}</p>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-plum leading-tight mb-6">
          {t.title}
        </h1>

        <div className="space-y-3 text-left bg-lav-50/60 border border-lav-100 rounded-2xl p-5 sm:p-6 mb-6">
          <ThankLine>{t.line1}</ThankLine>
          <ThankLine>{t.line2}</ThankLine>
          <ThankLine accent>{t.line3}</ThankLine>
        </div>

        {workshop && (
          <div className="rounded-2xl border border-lav-100 p-5 mb-7 text-left">
            <p className="text-[10px] font-bold text-plum/35 uppercase tracking-[0.2em] mb-2">
              {t.detailsTitle}
            </p>
            <p className="font-display text-lg text-plum">{workshop.title}</p>
            <p className="text-sm text-plum/55 mt-1">
              📅 {formatWorkshopDate(workshop, locale)} · 🕒 {formatWorkshopTime(workshop, locale)}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {workshop && (
            <a
              href={googleCalendarUrl(workshop)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-lav-200 bg-white text-plum px-6 py-3 text-sm font-medium hover:bg-lav-50 hover:border-lav-300 transition-colors cursor-pointer"
            >
              📅 {t.addCalendar}
            </a>
          )}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lav-600 text-white px-6 py-3 text-sm font-medium hover:bg-lav-700 transition-colors"
          >
            {t.backHome}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function ThankLine({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`flex-shrink-0 mt-0.5 ${accent ? "text-gold-500" : "text-lav-500"}`}
        aria-hidden
      >
        {accent ? "⭐" : "✓"}
      </span>
      <p className={`text-sm leading-relaxed ${accent ? "text-plum font-medium" : "text-plum/70"}`}>
        {children}
      </p>
    </div>
  );
}
