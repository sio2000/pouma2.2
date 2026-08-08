"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import {
  QuoteBubbleIcon,
  ResetIcon,
  PracticeIcon,
  CrestIcon,
  BriefcaseIcon,
  StrategyIcon,
  ChatIcon,
} from "@/components/home/HomeIcons";
import { EASE_LUXURY } from "@/lib/motion";

type Program = { title: string; desc: string; featured?: boolean };

const MAIN_ICONS = [QuoteBubbleIcon, ResetIcon, PracticeIcon, CrestIcon];
const EXTRA_ICONS = [BriefcaseIcon, StrategyIcon, ChatIcon];

const Arrow = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

/**
 * "Τα προγράμματά μας" — four programmes across the top, the certification one
 * carried in plum so it reads as the flagship, then the three shorter offers on
 * a second, deliberately lighter row beneath.
 */
export default function ProgramsShowcase() {
  const t = useTranslations("home.programs");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const main = t.raw("main") as Program[];
  const extra = t.raw("extra") as Program[];
  const href = `/${locale}/programs`;

  return (
    <section className="relative overflow-hidden bg-home-paper px-5 pb-24 sm:px-6">
      <div ref={ref} className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
          className="home-display text-center text-[color:var(--home-ink)] text-[clamp(1.9rem,4.2vw,2.9rem)]"
        >
          {t("title")}
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {main.map((program, i) => {
            const Icon = MAIN_ICONS[i % MAIN_ICONS.length];
            const featured = Boolean(program.featured);

            return (
              <motion.article
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.15 + i * 0.1, ease: EASE_LUXURY }}
                className={
                  featured
                    ? "group relative flex flex-col rounded-xl border-2 border-[color:var(--home-brass)] bg-home-ink p-7 pt-9 text-center shadow-[0_20px_50px_rgba(36,22,64,0.28)] transition-transform duration-500 hover:-translate-y-1.5"
                    : "home-card group flex flex-col p-7 text-center"
                }
              >
                {featured && (
                  <span className="absolute right-4 top-4 rounded-sm border border-[color:var(--home-brass)]/60 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-brass">
                    {t("badge")}
                  </span>
                )}

                <span
                  className={`home-medallion mx-auto h-[3.4rem] w-[3.4rem] ${
                    featured ? "border-[color:var(--home-brass)]" : ""
                  }`}
                >
                  <Icon className="h-7 w-7" />
                </span>

                <h3
                  className={`home-display mt-6 text-[1.22rem] ${
                    featured ? "text-white" : "text-[color:var(--home-ink)]"
                  }`}
                >
                  {program.title}
                </h3>

                <p
                  className={`mt-4 flex-1 text-[13.5px] leading-[1.7] ${
                    featured ? "text-white/62" : "text-[color:var(--home-ink)]/62"
                  }`}
                >
                  {program.desc}
                </p>

                <Link
                  href={href}
                  className="mt-6 inline-flex items-center justify-center gap-2 text-[13px] font-semibold text-brass transition-colors hover:text-[color:var(--home-brass-soft)]"
                >
                  {t("more")}
                  <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  <span className="sr-only">— {program.title}</span>
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* Second row — same language, deliberately quieter and shorter. */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {extra.map((program, i) => {
            const Icon = EXTRA_ICONS[i % EXTRA_ICONS.length];
            return (
              <motion.article
                key={program.title}
                initial={{ opacity: 0, y: 26 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.55 + i * 0.1, ease: EASE_LUXURY }}
                className="home-card group flex flex-col p-6 text-center"
              >
                <span className="home-medallion mx-auto h-11 w-11">
                  <Icon className="h-[22px] w-[22px]" />
                </span>

                <h3 className="home-display mt-4 text-[1.02rem] text-[color:var(--home-ink)]">
                  {program.title}
                </h3>

                <p className="mt-3 flex-1 text-[12.5px] leading-[1.65] text-[color:var(--home-ink)]/60">
                  {program.desc}
                </p>

                <Link
                  href={href}
                  className="mt-5 inline-flex items-center justify-center gap-2 text-[12.5px] font-semibold text-brass transition-colors hover:text-[color:var(--home-brass-soft)]"
                >
                  {t("more")}
                  <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  <span className="sr-only">— {program.title}</span>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
