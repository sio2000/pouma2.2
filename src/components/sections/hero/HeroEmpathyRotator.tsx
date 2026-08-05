"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

const HOLD_MS = 2600;

/**
 * The "I know how you feel" beat. A bold script label leads (same typeface as
 * the brand tagline); beneath it ONE inner fear shows at a time inside a
 * compact glass card, cross-fading with a soft blur. Kept tight so the hero
 * reads confident and full rather than empty.
 */
export default function HeroEmpathyRotator() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const phrases = t.raw("empathy") as string[];
  const eyebrow = t("empathyEyebrow");
  const label = t("empathyLabel");
  const answer = t("empathyAnswer");
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || phrases.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [reduce, phrases.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.35, ease: EASE_LUXURY }}
      className="lg:pt-1"
    >
      {/* The line that frames the rotating fears as a shared, familiar feeling.
          It is the heading of this band, not a footnote to it: the client could
          not see it as a small caption, so it now carries the section. */}
      <div className="mb-8 flex items-center justify-center gap-4 sm:gap-6">
        <span
          className="h-px flex-1 max-w-[6rem] sm:max-w-[10rem] bg-gradient-to-r from-transparent to-[color:var(--editorial-bronze)]"
          aria-hidden
        />
        <h2 className="font-display font-light text-plum tracking-[-0.02em] leading-[1.1] text-[clamp(1.9rem,4.6vw,3.1rem)] text-center whitespace-nowrap">
          {eyebrow}
        </h2>
        <span
          className="h-px flex-1 max-w-[6rem] sm:max-w-[10rem] bg-gradient-to-l from-transparent to-[color:var(--editorial-bronze)]"
          aria-hidden
        />
      </div>

      {/* The card holding one rotating fear at a time — the "problem". Given
          real size so it registers on the way down the page. */}
      <div
        className="card-editorial relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10 min-h-[8rem] sm:min-h-[9.5rem] flex items-center justify-center w-full max-w-3xl mx-auto shadow-gold-glow"
        aria-live="polite"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-3 -inset-y-3 -z-10 rounded-[2.25rem] bg-gradient-to-br from-lav-100/70 via-transparent to-gold-200/55 blur-2xl"
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: EASE_LUXURY }}
            className="font-display italic text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.25] text-plum text-center"
          >
            <span
              className="font-display not-italic text-gold-400 text-[1.3em] leading-none mr-1.5 align-[-0.3em]"
              aria-hidden
            >
              &ldquo;
            </span>
            {phrases[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Connector — a thin vertical line that visually flows the eye from the
          "problem" card straight down into the explanation, so the answer reads
          as a continuation rather than a separate block. */}
      <div className="flex justify-center" aria-hidden>
        <span className="my-2 block h-10 w-px bg-gradient-to-b from-[color:var(--editorial-bronze)] to-lav-300/40" />
      </div>

      {/* The reason + the fix — one smooth thought that says: we know why this
          happens, and here is how we solve it. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: EASE_LUXURY }}
        className="card-editorial relative overflow-hidden px-6 py-7 sm:px-10 sm:py-9 max-w-3xl mx-auto"
      >
        {/* Warm accent bar on the leading edge. */}
        <span
          className="absolute inset-y-6 left-0 w-[3px] rounded-full bg-gradient-to-b from-[color:var(--editorial-bronze)] to-lav-400/60"
          aria-hidden
        />
        <div className="pl-3 text-center">
          <span className="font-script leading-none text-plum text-[clamp(1.35rem,2vw,1.85rem)] drop-shadow-[0_2px_14px_rgba(120,80,160,0.18)]">
            {label}
          </span>
          <span className="mt-3 block text-[clamp(1.02rem,1.35vw,1.2rem)] leading-relaxed text-editorial-body">
            {answer}
          </span>
          <Link
            href={`/${locale}/about`}
            className="group mt-5 inline-flex items-center gap-1.5 rounded-md border border-plum/25 px-5 py-2.5 text-[13.5px] font-semibold text-plum hover:bg-plum hover:text-white hover:border-plum transition-colors"
          >
            {t("empathyMore")}
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
