"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";
import { DimitraVideoGrid } from "@/components/sections/DimitraVideosSection";

/* One mark per stage, in order: the conversation, the reset, the professional
   room, the aim. Hairline weight, same as everywhere else on the page. */
const STAGE_ICONS = [
  <g key="s1">
    <path d="M4 6.5h16v10H10l-4 3.5v-3.5H4z" />
    <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" />
  </g>,
  <g key="s2">
    <path d="M19.5 12a7.5 7.5 0 01-13 5M4.5 12a7.5 7.5 0 0113-5" />
    <path d="M17.5 3.5v3.5H14M6.5 20.5V17H10" />
  </g>,
  <g key="s3">
    <rect x="3" y="7.5" width="18" height="12" rx="2" />
    <path d="M9 7.5V5.5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 5.5v2M3 13h18" />
    <circle cx="12" cy="13.4" r="1.1" />
  </g>,
  <g key="s4">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 12l7-7M17 3.5l.5 3 3 .5" />
  </g>,
];

/**
 * The Pouma Method as a path (μονοπάτι) rather than four detached boxes — the
 * arrangement the client singled out in the second mockup. A single bronze line
 * runs the width of the section, four numbered nodes sit on it, and each stage
 * hangs beneath its node, separated by hairlines instead of card borders.
 */
export default function MethodSection() {
  const t = useTranslations("method");
  const tVideos = useTranslations("dimitraVideos");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const stages = t.raw("stages") as string[];

  return (
    <section className="relative py-20 md:py-24 px-5 sm:px-6 overflow-hidden bg-editorial-paper">
      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <div className="text-center">
          {/* Gold hairline ornament — same mark as the intro section. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_LUXURY }}
            className="inline-flex items-center gap-3"
          >
            <span className="w-8 h-px bg-gold-400/70" aria-hidden />
            <span className="text-eyebrow text-lav-600">{t("journeyLabel")}</span>
            <span className="w-8 h-px bg-gold-400/70" aria-hidden />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="mt-5 text-display-xl text-gradient text-[clamp(2rem,4.4vw,3.1rem)]"
          >
            {t("label")}
          </motion.h2>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_LUXURY }}
            className="mx-auto mt-6 block h-[2px] w-16 origin-center rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 shadow-[0_0_10px_rgba(245,179,53,0.55)]"
            aria-hidden
          />
        </div>

        {/* The path itself. The line is drawn once and the nodes sit on it, so
            the four stages read as one continuous route, not four options. */}
        <div className="relative mt-16">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[1.4rem] hidden md:block" aria-hidden>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.35, ease: EASE_LUXURY }}
              className="block h-px origin-left bg-gradient-to-r from-gold-400/30 via-gold-500/80 to-gold-400/30"
            />
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {stages.map((stage, i) => (
              <motion.li
                key={stage}
                initial={{ opacity: 0, y: 26 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.45 + i * 0.13, ease: EASE_LUXURY }}
                className="group relative flex flex-col items-center px-5 pb-8 pt-0 text-center md:px-6 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-[color:var(--editorial-line)]"
              >
                {/* Node — the number that sits on the path. */}
                <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-plum font-display text-[1.05rem] text-white shadow-[0_6px_18px_rgba(46,31,82,0.28)] transition-transform duration-500 group-hover:-translate-y-1">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="mt-6 text-plum/60 transition-colors duration-400 group-hover:text-gold-500" aria-hidden>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {STAGE_ICONS[i % STAGE_ICONS.length]}
                  </svg>
                </span>

                <h3 className="mt-5 font-display text-plum text-[1.2rem] leading-[1.22] tracking-tight">
                  {stage}
                </h3>
                <span className="mt-4 block h-[2px] w-10 rounded-full bg-gradient-to-r from-gold-400 to-gold-300/40" aria-hidden />
              </motion.li>
            ))}
          </ol>
        </div>

        {/* The short clips of Δήμητρα stay with the method — they are the proof
            that the path is taught by a person, not a syllabus. */}
        <div className="mt-16 md:mt-20 border-t border-[color:var(--editorial-line)] pt-14">
          <p className="eyebrow-editorial text-center mb-8">{tVideos("label")}</p>
          <DimitraVideoGrid compact />
        </div>
      </div>
    </section>
  );
}
