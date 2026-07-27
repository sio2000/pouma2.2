"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { getWorkshopContent } from "@/lib/workshops/content";
import { formatWorkshopDate } from "@/lib/workshops/status";
import { EASE_LUXURY } from "@/lib/motion";
import type { WorkshopView } from "@/lib/workshops/types";

type Service = { title: string };

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

/** One distinct icon per service, in order, so each card has its own identity. */
const SERVICE_ICONS = [
  // Presentations — screen with a rising bar
  <g key="i0">
    <rect x="3" y="4" width="18" height="12" rx="1.6" />
    <path d="M12 16v4M8 20h8M8.5 12l2.2-2.6 1.8 1.6 2.8-3.4" />
  </g>,
  // Interviews / meetings — chat bubbles
  <g key="i1">
    <path d="M4 5.5h11a2 2 0 0 1 2 2V13a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2Z" />
    <path d="M20 9h.01M20 9a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2v2l-2.2-1.6" opacity="0.55" />
  </g>,
  // Structured thinking — layered idea
  <g key="i2">
    <path d="M12 3l8 4.5-8 4.5-8-4.5L12 3Z" />
    <path d="M4 12l8 4.5 8-4.5M4 16.5L12 21l8-4.5" opacity="0.6" />
  </g>,
  // Leadership — megaphone
  <g key="i3">
    <path d="M4 10v4a1 1 0 0 0 1 1h2l7 4V5L7 9H5a1 1 0 0 0-1 1Z" />
    <path d="M17.5 8.5a4 4 0 0 1 0 7" opacity="0.6" />
  </g>,
  // Confidence & presence — spark / star
  <g key="i4">
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
    <path d="M19 15l.6 1.6L21 17.2l-1.4.6L19 19.4l-.6-1.6L17 17.2l1.4-.6L19 15Z" opacity="0.6" />
  </g>,
  // Critical analysis — magnifier
  <g key="i5">
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4-4M9 11h4M11 9v4" opacity="0.85" />
  </g>,
];

/** Rotating accent palette so the grid reads colourful yet cohesive. */
const ACCENTS = [
  {
    bar: "from-lav-400 via-lav-500 to-lav-600",
    tint: "from-white via-white to-lav-50",
    chip: "from-lav-500 to-lav-700",
    num: "text-lav-500/30",
    hoverBorder: "hover:border-lav-400",
  },
  {
    bar: "from-gold-300 via-gold-400 to-kroke-400",
    tint: "from-white via-white to-gold-200/40",
    chip: "from-gold-300 to-gold-500",
    num: "text-gold-500/35",
    hoverBorder: "hover:border-gold-400",
  },
  {
    bar: "from-lav-600 via-plum to-lav-700",
    tint: "from-white via-white to-lav-100/70",
    chip: "from-plum to-lav-700",
    num: "text-plum/25",
    hoverBorder: "hover:border-lav-500",
  },
];

/**
 * The coach's course programme — surfaced as a full-width horizontal row that
 * stretches across the BOTTOM of the hero (per the client's layout sketch).
 * Same source of truth as the "Coaching Επικοινωνίας" section.
 */
export default function HeroProgramsPanel() {
  const t = useTranslations("hero");
  const tc = useTranslations("cta");
  const tComm = useTranslations("communication");
  const locale = useLocale();

  const services = tComm.raw("skills") as Service[];

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: EASE_LUXURY }}
        className="flex items-center gap-3 mb-5 justify-center lg:justify-start"
      >
        <span className="h-px w-10 bg-gradient-to-r from-gold-400 to-transparent" aria-hidden />
        <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-lav-700">
          {t("servicesLabel")}
        </span>
        <span className="h-px w-10 bg-gradient-to-l from-gold-400 to-transparent lg:hidden" aria-hidden />
      </motion.div>

      {/* Horizontal programme row — 2 up on mobile, 3 on tablet, all six across
          on desktop so the cards spread edge-to-edge along the hero base. */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 lg:gap-4">
        {services.map((service, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <motion.li
              key={service.title}
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.5 + i * 0.07, ease: EASE_LUXURY }}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Link
                href={`/${locale}/programs`}
                className={`group relative flex h-full min-h-[8.5rem] flex-col overflow-hidden rounded-2xl border border-lav-100 bg-gradient-to-br ${accent.tint} hover:border-gold-400 hover:shadow-gold-glow px-4 pb-4 pt-4 shadow-medium transition-[border-color,box-shadow] duration-300`}
              >
                {/* Whole-card gold wash that fades in on hover — the signature
                    "the frame turns gold" effect, kept on-brand. */}
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold-200/85 via-gold-300/55 to-gold-400/70 opacity-0 transition-opacity duration-400 ease-out group-hover:opacity-100"
                  aria-hidden
                />
                {/* Gold shine that sweeps across on hover. */}
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  aria-hidden
                />
                {/* Always-visible colour bar across the top — the "pop". */}
                <span
                  className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent.bar}`}
                  aria-hidden
                />
                {/* Oversized ghost number in the corner for depth. */}
                <span
                  className={`pointer-events-none absolute -top-1 right-2 font-display font-light leading-none ${accent.num} text-[3.4rem] select-none`}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative flex items-start justify-between">
                  {/* Solid gradient icon chip — high contrast, white glyph. */}
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accent.chip} text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                    aria-hidden
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.9}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {SERVICE_ICONS[i % SERVICE_ICONS.length]}
                    </svg>
                  </span>
                </div>

                <span className="relative mt-3 block font-sans font-extrabold text-[15px] sm:text-base text-plum leading-snug">
                  {service.title}
                </span>

                <span className="relative mt-auto pt-3 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-lav-600 transition-colors duration-300 group-hover:text-plum">
                  {tc("secondary")}
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.95, ease: EASE_LUXURY }}
        className="mt-6 flex justify-center lg:justify-start"
      >
        <Link
          href={`/${locale}/programs`}
          className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-lav-700 hover:text-lav-800 transition-colors"
        >
          {tc("secondary")}
          <ArrowIcon className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    </div>
  );
}

/**
 * The featured-workshop highlight card — the "come look at me" beat that lives
 * in the hero's right column beneath the empathy rotator.
 */
export function HeroWorkshopCard({ workshop }: { workshop: WorkshopView | null }) {
  const locale = useLocale();
  const content = getWorkshopContent(locale);

  return (
    <AnimatePresence>
      {workshop && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: EASE_LUXURY }}
          className="relative"
        >
          {/* Breathing glow halo — the "come look at me" cue. */}
          <motion.div
            aria-hidden
            animate={{ opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-1.5 rounded-[1.9rem] bg-gradient-to-r from-gold-300 via-kroke-400 to-gold-400 blur-xl pointer-events-none"
          />

          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }}>
            <Link
              href={`/${locale}/workshop/${workshop.slug}`}
              className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-plum via-lav-700 to-plum-mid px-5 py-4 shadow-strong"
            >
              {/* Warm decorative glow inside the card + shine sweep on hover. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-gold-400/30 blur-2xl"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full"
              />

              <span className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 shadow-gold-glow">
                <span className="absolute inline-flex h-full w-full rounded-2xl bg-gold-400 opacity-60 animate-ping" />
                <span className="relative text-plum text-lg font-bold" aria-hidden>
                  ✦
                </span>
              </span>

              <span className="relative flex-1 min-w-0">
                <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 px-2.5 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-300 animate-pulse" aria-hidden />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-200">
                    {content.popup.eyebrow}
                  </span>
                </span>
                <span className="block text-[15px] sm:text-base font-bold text-white leading-snug">
                  {workshop.title}
                </span>
                <span className="block text-xs font-medium text-gold-200/90 mt-0.5">
                  {formatWorkshopDate(workshop, locale)}
                </span>
              </span>

              <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-plum shadow-medium transition-transform duration-300 group-hover:scale-110">
                <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
