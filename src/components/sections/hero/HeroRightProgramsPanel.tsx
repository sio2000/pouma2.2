"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

type Service = { title: string; emotion?: string };

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

/**
 * Full-width programme grid shown beneath the hero. Each card mirrors the gold
 * "intro" cards (Ξέρεις Αγγλικά… section): white/blur base, gold border + wash
 * on hover, a sweeping shine, a gold icon tile and a large ghost number.
 */
export default function HeroRightProgramsPanel() {
  const tComm = useTranslations("communication");
  const locale = useLocale();

  const services = tComm.raw("skills") as Service[];

  return (
    <div className="w-full">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 w-full">
        {services.map((service, i) => {
          const flip = i === 0 && Boolean(service.emotion);

          // The flip card: front shows the raw feeling, the back reveals the
          // programme name — same font, size and colour as the other titles.
          if (flip) {
            return (
              <motion.li
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.6, ease: EASE_LUXURY }}
                className="h-full min-h-[130px] [perspective:1200px]"
              >
                <Link
                  href={`/${locale}/programs`}
                  className="group/flip relative block h-full min-h-[130px]"
                >
                  <span className="relative block h-full min-h-[130px] w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover/flip:[transform:rotateY(180deg)]">
                    {/* FRONT — the feeling */}
                    <span className="absolute inset-0 flex flex-col justify-center rounded-2xl border border-lav-100 bg-gradient-to-br from-lav-50 to-gold-100/60 p-5 shadow-soft [backface-visibility:hidden]">
                      <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gold-300/70 text-plum text-base" aria-hidden>
                        ?
                      </span>
                      <span className="font-display text-[1.2rem] text-plum leading-[1.15] tracking-tight">
                        {service.emotion}
                      </span>
                    </span>
                    {/* BACK — the programme */}
                    <span className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-gold-400 bg-gold-200/50 p-5 shadow-gold-glow [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <span
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300/80 to-lav-100 border border-gold-300/50 text-gold-600"
                        aria-hidden
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          {SERVICE_ICONS[0]}
                        </svg>
                      </span>
                      <span className="font-display text-[1.2rem] text-plum leading-[1.15] tracking-tight">
                        {service.title}
                      </span>
                    </span>
                  </span>
                </Link>
              </motion.li>
            );
          }

          return (
            <motion.li
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE_LUXURY }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 320, damping: 18 },
              }}
              className="h-full min-h-[130px]"
            >
              <Link
                href={`/${locale}/programs`}
                className="group relative flex h-full min-h-[130px] flex-col overflow-hidden rounded-2xl border border-lav-100 bg-white/90 backdrop-blur-sm p-5 shadow-soft transition-[border-color,background-color,box-shadow] duration-300 hover:border-gold-400 hover:bg-gold-200/40 hover:shadow-gold-glow"
              >
                {/* Gold sweep that wipes across on hover */}
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-300/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  aria-hidden
                />
                {/* Top accent bar grows in on hover */}
                <span
                  className="pointer-events-none absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-gold-400 to-gold-300 transition-transform duration-400 ease-out group-hover:scale-x-100"
                  aria-hidden
                />

                <div className="relative flex items-center justify-between gap-3 mb-4">
                  <span
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-200/70 to-lav-100 border border-gold-300/50 ring-1 ring-gold-200/50 text-gold-500 shadow-soft transition-colors duration-300 group-hover:from-gold-300/80 group-hover:text-gold-600"
                    aria-hidden
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {SERVICE_ICONS[i % SERVICE_ICONS.length]}
                    </svg>
                  </span>
                  <span
                    className="method-num font-display text-[2.4rem] font-light leading-none tracking-tight"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="relative font-display text-[1.2rem] text-plum leading-[1.15] tracking-tight">
                  {service.title}
                </h3>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
