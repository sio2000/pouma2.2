"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

type SkillItem = { title: string; detail: string; emotion?: string };

/* One mark per specialisation, in the order they appear in the copy. */
const SKILL_ICONS = [
  <g key="k0">
    <rect x="3" y="4.5" width="18" height="12" rx="1.8" />
    <path d="M12 16.5v3.5M8.5 20h7M8 12.5l2.4-2.8 1.9 1.7 2.9-3.6" />
  </g>,
  <g key="k1">
    <path d="M4 5.5h11a2 2 0 012 2V13a2 2 0 01-2 2H9l-4 3v-3H4a2 2 0 01-2-2V7.5a2 2 0 012-2z" />
    <path d="M20 9a2 2 0 012 2v4a2 2 0 01-2 2v2l-2.2-1.6" opacity="0.55" />
  </g>,
  <g key="k2">
    <path d="M12 3l8 4.5-8 4.5-8-4.5L12 3z" />
    <path d="M4 12l8 4.5 8-4.5M4 16.5L12 21l8-4.5" opacity="0.55" />
  </g>,
  <g key="k3">
    <path d="M4 10v4a1 1 0 001 1h2l7 4V5L7 9H5a1 1 0 00-1 1z" />
    <path d="M17.5 8.5a4 4 0 010 7" opacity="0.6" />
  </g>,
  <g key="k4">
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
    <path d="M19 15l.6 1.6L21 17.2l-1.4.6L19 19.4l-.6-1.6L17 17.2l1.4-.6L19 15z" opacity="0.6" />
  </g>,
  <g key="k5">
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4-4M9 11h4M11 9v4" opacity="0.85" />
  </g>,
];

/**
 * "Εξειδίκευση για τον στόχο σου" — the block the client liked directly beneath
 * the method path: three columns of quiet cards, each led by a round icon
 * badge, with the title, what it is for, and a link into the programmes. The
 * details are on the surface now instead of hidden behind a click, because the
 * reference shows the reader everything at a glance.
 */
export default function CommunicationSection() {
  const t = useTranslations("communication");
  const tHero = useTranslations("hero");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const skills = t.raw("skills") as SkillItem[];

  return (
    <section className="relative py-20 md:py-24 px-5 sm:px-6 overflow-hidden bg-editorial-flat">
      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_LUXURY }}
            className="eyebrow-editorial"
          >
            {t("label")}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="mt-4 font-display font-light text-plum tracking-[-0.02em] leading-[1.12] text-[clamp(1.9rem,4.2vw,2.9rem)]"
          >
            {t("headline")}{" "}
            <span className="text-gradient">{t("headline2")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.24, ease: EASE_LUXURY }}
            className="mt-5 text-editorial-body text-[15px] md:text-base"
          >
            {t("body")}
          </motion.p>
        </div>

        {/* The specialisation cards: kept compact per the client's note, but
            wearing the same gold hover the pain cards above them use — the
            sweep, the growing accent bar and the gold glow. */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, i) => (
            <motion.article
              key={skill.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + (i % 3) * 0.1, ease: EASE_LUXURY }}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 320, damping: 18 } }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-lav-100 bg-white/90 backdrop-blur-sm p-5 shadow-soft transition-[border-color,background-color,box-shadow] duration-300 hover:border-gold-400 hover:bg-gold-200/40 hover:shadow-gold-glow"
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

              <div className="relative flex items-start gap-3.5">
                <span className="badge-lav badge-lav-xs shrink-0" aria-hidden>
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {SKILL_ICONS[i % SKILL_ICONS.length]}
                  </svg>
                </span>
                <h3 className="font-display text-plum text-[1.05rem] leading-[1.22] tracking-tight pt-1">
                  {skill.title}
                </h3>
              </div>

              {skill.emotion && (
                <p className="relative mt-4 font-display italic text-bronze text-[13.5px] leading-snug">
                  {skill.emotion}
                </p>
              )}

              <p className="relative mt-3 text-[13px] leading-[1.7] text-editorial-body flex-1">
                {skill.detail}
              </p>

              <Link
                href={`/${locale}/programs`}
                className="relative mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-bronze transition-colors hover:text-plum"
              >
                {tHero("empathyMore")}
                <span className="sr-only">— {skill.title}</span>
                <svg
                  className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* The pull-quote closes the block, the way the mockups end a section
            with one line rather than another card. */}
        <motion.blockquote
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.65, ease: EASE_LUXURY }}
          className="mt-14 mx-auto max-w-3xl border-l-2 border-[color:var(--editorial-bronze)] pl-6 font-display italic text-lav-800 text-[1.1rem] md:text-[1.25rem] leading-relaxed"
        >
          {t("quote")}
        </motion.blockquote>
      </div>
    </section>
  );
}
