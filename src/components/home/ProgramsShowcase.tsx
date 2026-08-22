"use client";
import { Fragment, useRef } from "react";
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
import SeminarsCard from "@/components/home/SeminarsCard";
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
 * "Τα προγράμματά μας" — the core programmes across the top, then the shorter
 * offers on a second, quieter row. The `featured` branch below is kept because
 * the certification card may come back once it is awarded; nothing sets the
 * flag today. The seminars noticeboard sits inside that second row,
 * between the first and second card, and is the one violet plate among the
 * pale ones so it announces itself.
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
    <section className="relative overflow-hidden bg-home-paper pb-16 pt-6 md:pt-10">
      <div ref={ref} className="home-container">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
          className="home-display mt-2 text-center text-[color:var(--home-ink)] text-[clamp(1.7rem,3.2vw,2.35rem)] md:mt-4"
        >
          {t("title")}
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                    ? "home-card-dark group flex flex-col rounded-xl border-2 border-[color:var(--home-brass)] bg-home-ink p-6 pt-8 text-center shadow-[0_20px_50px_rgba(101,52,182,0.28)]"
                    : "home-card group flex flex-col p-6 text-center"
                }
              >
                {featured && (
                  <span className="text-brass-soft absolute right-4 top-4 rounded-sm border border-[color:var(--home-brass)]/60 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em]">
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
                  className={`home-display mt-5 text-[1.22rem] ${
                    featured ? "text-white" : "text-[color:var(--home-ink)]"
                  }`}
                >
                  {program.title}
                </h3>

                <p
                  className={`mt-3.5 flex-1 text-[15px] leading-[1.7] ${
                    featured ? "text-white/68" : "text-[color:var(--home-ink)]/62"
                  }`}
                >
                  {program.desc}
                </p>

                <Link
                  href={href}
                  className={`mt-6 inline-flex items-center justify-center gap-2 text-[14.5px] font-bold transition-colors ${
                    featured
                      ? "text-brass-soft hover:text-white"
                      : "text-brass hover:text-[color:var(--home-ink)]"
                  }`}
                >
                  {t("more")}
                  <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  <span className="sr-only">— {program.title}</span>
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* Second row — same language, deliberately quieter and shorter, with
            the seminars noticeboard dropped in at the second position. */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {extra.map((program, i) => {
            const Icon = EXTRA_ICONS[i % EXTRA_ICONS.length];

            const card = (
              <motion.article
                initial={{ opacity: 0, y: 26 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.55 + i * 0.1, ease: EASE_LUXURY }}
                className="home-card group flex flex-col p-6 text-center"
              >
                <span className="home-medallion mx-auto h-11 w-11">
                  <Icon className="h-[22px] w-[22px]" />
                </span>

                <h3 className="home-display mt-4 text-[1.14rem] text-[color:var(--home-ink)]">
                  {program.title}
                </h3>

                <p className="mt-3 flex-1 text-[14.5px] leading-[1.65] text-[color:var(--home-ink)]/68">
                  {program.desc}
                </p>

                <Link
                  href={href}
                  className="mt-5 inline-flex items-center justify-center gap-2 text-[14px] font-bold text-brass transition-colors hover:text-[color:var(--home-ink)]"
                >
                  {t("more")}
                  <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  <span className="sr-only">— {program.title}</span>
                </Link>
              </motion.article>
            );

            return i === 0 ? (
              <Fragment key={program.title}>
                {card}
                <SeminarsCard delay={0.65} />
              </Fragment>
            ) : (
              <Fragment key={program.title}>{card}</Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
