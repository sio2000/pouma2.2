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
      {/* Small eyebrow that frames the rotating fears as a shared, familiar feeling. */}
      <div className="mb-4 flex items-center gap-2.5 justify-center">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-[color:var(--editorial-bronze)]" aria-hidden />
        <span className="eyebrow-editorial">{eyebrow}</span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-[color:var(--editorial-bronze)]" aria-hidden />
      </div>

      {/* Slim glass card holding one rotating fear at a time — the "problem".
          Kept wide and short (spread in length, not height) per client request. */}
      <div
        className="card-editorial relative overflow-hidden px-5 py-4 sm:px-7 min-h-[4.5rem] flex items-center justify-center w-full max-w-2xl mx-auto"
        aria-live="polite"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-2 -inset-y-2 -z-10 rounded-[2rem] bg-gradient-to-br from-lav-100/60 via-transparent to-gold-100/50 blur-2xl"
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: EASE_LUXURY }}
            className="font-display italic text-[clamp(1.15rem,1.55vw,1.5rem)] leading-snug text-plum text-center"
          >
            <span
              className="font-display not-italic text-gold-400 text-[1.4em] leading-none mr-1.5 align-[-0.3em]"
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
        <span className="my-1 block h-7 w-px bg-gradient-to-b from-[color:var(--editorial-bronze)] to-lav-300/40" />
      </div>

      {/* The reason + the fix — one smooth thought that says: we know why this
          happens, and here is how we solve it. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: EASE_LUXURY }}
        className="card-editorial relative overflow-hidden px-6 py-6 sm:px-8 sm:py-7"
      >
        {/* Warm accent bar on the leading edge. */}
        <span
          className="absolute inset-y-5 left-0 w-[3px] rounded-full bg-gradient-to-b from-[color:var(--editorial-bronze)] to-lav-400/60"
          aria-hidden
        />
        <div className="pl-3 text-center">
          <span className="font-script leading-none text-plum text-[clamp(1.1rem,1.5vw,1.4rem)] drop-shadow-[0_2px_14px_rgba(120,80,160,0.18)]">
            {label}
          </span>
          <span className="mt-2 block text-[clamp(0.98rem,1.1vw,1.1rem)] leading-snug text-editorial-body">
            {answer}
          </span>
          <Link
            href={`/${locale}/about`}
            className="group mt-4 inline-flex items-center gap-1.5 rounded-md border border-plum/25 px-4 py-2 text-[13px] font-semibold text-plum hover:bg-plum hover:text-white hover:border-plum transition-colors"
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
