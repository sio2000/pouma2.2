"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Countdown from "@/components/workshops/Countdown";
import WorkshopRegistrationForm from "@/components/workshops/WorkshopRegistrationForm";
import ResourceImage from "@/components/resources/ResourceImage";
import { getWorkshopContent } from "@/lib/workshops/content";
import { resolveMediaUrl } from "@/lib/upload-url";
import { formatWorkshopDate, formatWorkshopTime } from "@/lib/workshops/status";
import { EASE_LUXURY } from "@/lib/motion";
import type { WorkshopView } from "@/lib/workshops/types";

interface Props {
  workshop: WorkshopView;
  locale: string;
}

function scrollToRegister() {
  document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function WorkshopLanding({ workshop, locale }: Props) {
  const content = getWorkshopContent(locale);
  const banner = resolveMediaUrl(workshop.bannerUrl);
  const startMs = new Date(workshop.startsAt).getTime();
  const isCompleted = workshop.status === "completed";
  const isLive = workshop.status === "live";
  const canRegister = workshop.active && !isCompleted;

  const dateText = formatWorkshopDate(workshop, locale);
  const timeText = formatWorkshopTime(workshop, locale);
  const paragraphs = workshop.description
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const statusBadge = isCompleted
    ? content.status.completed
    : isLive
      ? content.hero.liveNow
      : content.status.upcoming;

  return (
    <div className="bg-ivory">
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {banner ? (
            <>
              <ResourceImage src={banner} alt={workshop.title} fill />
              <div className="absolute inset-0 bg-gradient-to-b from-plum/80 via-plum/70 to-plum/90" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-lav-700 via-plum-mid to-plum" />
          )}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-lav-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gold-400/15 blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_LUXURY }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] border ${
              isLive
                ? "bg-red-500/20 border-red-300/40 text-red-100"
                : isCompleted
                  ? "bg-white/10 border-white/20 text-white/70"
                  : "bg-gold-400/20 border-gold-300/40 text-gold-200"
            }`}
          >
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse" />}
            {statusBadge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="font-display font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mt-6"
          >
            {workshop.title}
          </motion.h1>

          {workshop.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-white/75 text-lg sm:text-xl font-light max-w-2xl mx-auto mt-5 leading-relaxed"
            >
              {workshop.subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
              📅 {dateText}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
              🕒 {timeText}
            </span>
          </motion.div>

          {!isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-10 flex flex-col items-center gap-8"
            >
              {!isLive && (
                <div>
                  <p className="text-[10px] font-bold text-white/45 uppercase tracking-[0.25em] mb-3">
                    {content.hero.startsIn}
                  </p>
                  <Countdown targetMs={startMs} labels={content.countdown} variant="dark" />
                </div>
              )}
              {canRegister && (
                <button
                  type="button"
                  onClick={scrollToRegister}
                  className="relative rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 text-plum font-semibold px-9 py-4 text-[15px] shadow-gold-glow hover:from-gold-300 hover:to-gold-400 transition-colors cursor-pointer"
                >
                  {content.hero.cta} →
                </button>
              )}
            </motion.div>
          )}

          {isCompleted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-white/60 text-sm"
            >
              {content.hero.endedNote}
            </motion.p>
          )}
        </div>
      </section>

      {/* ── About / description ────────────────────────── */}
      {paragraphs.length > 0 && (
        <Section>
          <Eyebrow>{content.about.eyebrow}</Eyebrow>
          <SectionTitle>{content.about.title}</SectionTitle>
          <div className="max-w-2xl mx-auto mt-8 space-y-5 text-center">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-body-premium text-lg whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
        </Section>
      )}

      {/* ── Registration ───────────────────────────────── */}
      <section
        id="register"
        className="scroll-mt-24 relative overflow-hidden bg-ivory py-16 sm:py-20 md:py-24 px-4 sm:px-6"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 w-[420px] h-[420px] rounded-full bg-lav-100/60 blur-3xl" />
          <div className="absolute bottom-0 -left-16 w-80 h-80 rounded-full bg-gold-200/30 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {canRegister ? (
            <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 lg:gap-8 items-stretch">
              {/* Aside — recap & reassurance */}
              <aside className="relative rounded-3xl overflow-hidden bg-dark-section text-white shadow-medium border border-lav-200/20">
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-lav-700/30 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-gold-400/12 blur-3xl" />
                </div>
                <div className="relative z-10 p-7 sm:p-8 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-7 h-px bg-gold-400/70" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-200">
                      {content.register.eyebrow}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl leading-tight mb-5">
                    {workshop.title}
                  </h3>

                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                      <span className="text-gold-300">📅</span>
                      <span className="text-sm text-white/85">{dateText}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                      <span className="text-gold-300">🕒</span>
                      <span className="text-sm text-white/85">{timeText}</span>
                    </div>
                  </div>

                  {!isLive && (
                    <div className="mb-6">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.22em] mb-3">
                        {content.hero.startsIn}
                      </p>
                      <Countdown targetMs={startMs} labels={content.countdown} variant="dark" />
                    </div>
                  )}

                  <div className="mt-auto rounded-2xl border border-gold-400/30 bg-gold-400/10 px-5 py-4">
                    <p className="font-display text-base text-white/90 leading-snug">
                      {content.cta.text}
                    </p>
                  </div>
                </div>
              </aside>

              {/* Form */}
              <div>
                <WorkshopRegistrationForm
                  workshopId={workshop.id}
                  slug={workshop.slug}
                  locale={locale}
                  content={content}
                />
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto bg-white rounded-3xl border border-lav-100 p-10 text-center shadow-medium">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center mx-auto mb-5 text-2xl text-white">
                {isCompleted ? "✓" : "🔒"}
              </div>
              <h3 className="font-display text-2xl text-plum mb-2">
                {isCompleted ? content.register.completedTitle : content.register.closedTitle}
              </h3>
              <p className="text-body-premium">
                {isCompleted ? content.register.completedText : content.register.closedText}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <Section tone="elevated">
        <div className="max-w-2xl mx-auto">
          <Eyebrow>{content.faq.eyebrow}</Eyebrow>
          <SectionTitle>{content.faq.title}</SectionTitle>
          <div className="mt-10 space-y-3.5">
            {content.faq.items.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* ── Final CTA ──────────────────────────────────── */}
      {canRegister && (
        <section className="bg-ivory px-4 sm:px-6 pb-20 sm:pb-28 pt-4">
          <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden bg-dark-section shadow-strong">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-lav-700/30 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-gold-400/15 blur-3xl" />
              <div className="absolute inset-0 dot-grid opacity-[0.04]" />
            </div>
            <div className="relative z-10 text-center py-14 sm:py-16 px-6 sm:px-10">
              <h2 className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
                {content.cta.title}
              </h2>
              <p className="text-white/55 text-lg mt-4 mb-9 max-w-md mx-auto">{content.cta.text}</p>
              <button
                type="button"
                onClick={scrollToRegister}
                className="relative rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 text-plum font-semibold px-9 py-4 text-[15px] shadow-gold-glow hover:from-gold-300 hover:to-gold-400 transition-colors cursor-pointer"
              >
                {content.cta.button} →
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Local presentational helpers ─────────────────────── */

function Section({
  children,
  tone = "plain",
}: {
  children: React.ReactNode;
  tone?: "plain" | "elevated";
}) {
  return (
    <section
      className={`py-16 sm:py-20 md:py-24 px-4 sm:px-6 ${
        tone === "elevated" ? "bg-section-elevated" : "bg-ivory"
      }`}
    >
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="w-8 h-px bg-gold-400/70" />
      <span className="text-eyebrow text-lav-600">{children}</span>
      <span className="w-8 h-px bg-gold-400/70" />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.7, ease: EASE_LUXURY }}
      className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-plum text-center leading-tight tracking-tight mt-3"
    >
      {children}
    </motion.h2>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: EASE_LUXURY }}
      className={`rounded-2xl bg-white shadow-soft overflow-hidden border transition-colors duration-300 ${
        open ? "border-gold-300" : "border-lav-100 hover:border-lav-200"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span
          className={`font-display text-[16px] sm:text-lg leading-snug transition-colors ${
            open ? "text-plum" : "text-plum/90 group-hover:text-plum"
          }`}
        >
          {q}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base transition-all duration-300 ${
            open
              ? "bg-gradient-to-br from-gold-400 to-gold-500 text-white rotate-45 shadow-gold-glow"
              : "bg-lav-50 border border-lav-100 text-lav-700 group-hover:border-gold-300 group-hover:text-gold-500"
          }`}
        >
          +
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE_LUXURY }}
        className="overflow-hidden"
      >
        <p className="px-5 sm:px-6 pb-5 text-body-premium text-sm sm:text-[15px] leading-relaxed">
          {a}
        </p>
      </motion.div>
    </motion.div>
  );
}
