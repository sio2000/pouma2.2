"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { CalendarIcon } from "@/components/sections/hero/HeroTrustIcons";
import { EASE_LUXURY } from "@/lib/motion";

/**
 * The closing invitation, as a single horizontal strip directly under the plum
 * puma band: a ringed calendar mark on the left, the question and the promise
 * in the middle, the buttons on the right. One line of the page, not a box.
 */
export default function CtaSection() {
  const t = useTranslations("cta");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <section className="relative overflow-hidden bg-editorial-flat px-5 sm:px-6 py-14 md:py-16">
      <div
        ref={ref}
        className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center lg:flex-row lg:items-center lg:gap-10 lg:text-left"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: EASE_LUXURY }}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[color:var(--editorial-line)] bg-white text-plum/70 shadow-[0_8px_24px_rgba(46,31,82,0.06)]"
          aria-hidden
        >
          <CalendarIcon className="h-7 w-7" />
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE_LUXURY }}
          className="flex-1"
        >
          <h2 className="font-display font-light text-plum tracking-[-0.02em] leading-[1.15] text-[clamp(1.5rem,3vw,2.1rem)]">
            {t("headline")} <span className="text-gradient">{t("headline2")}</span>
          </h2>
          <p className="mt-2.5 text-editorial-body text-[15px]">{t("body")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.2, ease: EASE_LUXURY }}
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0"
        >
          <Link
            href={`/${locale}/contact`}
            className="group inline-flex items-center justify-center gap-2.5 rounded-md bg-plum px-7 py-4 text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(46,31,82,0.22)] transition-all duration-300 hover:bg-lav-800 hover:-translate-y-0.5"
          >
            {t("primary")}
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href={`/${locale}/programs`}
            className="inline-flex items-center justify-center rounded-md border border-plum/30 px-7 py-4 text-[15px] font-semibold text-plum transition-all duration-300 hover:border-plum hover:bg-white hover:-translate-y-0.5"
          >
            {t("secondary")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
