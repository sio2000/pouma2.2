"use client";
import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { EASE_LUXURY } from "@/lib/motion";

type IntroCard = { tag: string; title: string; desc: string };

/* Hairline marks, drawn to the same weight so the three cards read as a set:
   the person, the problem, the way out. */
const ICONS: ReactNode[] = [
  <g key="who">
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5.5 19.5c0-3.7 2.9-5.6 6.5-5.6s6.5 1.9 6.5 5.6" />
  </g>,
  <g key="problem">
    <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    <path d="M9.4 4.6L12 6.9l2.6-2.3M9.4 19.4L12 17.1l2.6 2.3" opacity="0.6" />
  </g>,
  <g key="how">
    <path d="M8 4.5a4.5 4.5 0 00-.6 8.9V19h2.4v-5.6A4.5 4.5 0 008 4.5z" />
    <path d="M13.5 8.6a4 4 0 010 6.8M16.5 6.4a7.5 7.5 0 010 11.2" opacity="0.6" />
  </g>,
];

/**
 * "Δεν χρειάζεσαι άλλη μία αρχή από το μηδέν" — the beat straight after the
 * hero in the mockups: a centred serif statement, a bronze line beneath it, and
 * three quiet white cards, each led by a round lavender icon badge. Everything
 * is centred and generously spaced; nothing shouts.
 */
export default function IntroSection() {
  const t = useTranslations("intro");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const cards = t.raw("cards") as IntroCard[];

  return (
    <section className="relative py-20 md:py-28 px-5 sm:px-6 overflow-hidden bg-editorial-flat">
      <div ref={ref} className="relative z-10 max-w-6xl mx-auto">
        {/* Gold hairline ornament around the eyebrow — the brand's own mark. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_LUXURY }}
          className="flex items-center justify-center gap-3"
        >
          <span className="w-8 h-px bg-gold-400/70" aria-hidden />
          <span className="text-eyebrow text-lav-600">{t("eyebrow")}</span>
          <span className="w-8 h-px bg-gold-400/70" aria-hidden />
        </motion.div>

        <div className="mt-6 text-center max-w-3xl mx-auto">
          <div className="overflow-hidden pb-1">
            <motion.h2
              initial={{ y: "110%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
              className="text-display-xl text-plum text-[clamp(1.9rem,4.6vw,3.1rem)]"
            >
              {t("headline1")}
            </motion.h2>
          </div>
          <div className="overflow-hidden pb-1">
            <motion.h2
              initial={{ y: "110%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: EASE_LUXURY }}
              className="text-display-xl text-gradient text-[clamp(1.9rem,4.6vw,3.1rem)]"
            >
              {t("headline2")}
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mt-14">
          {cards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.35 + i * 0.12, ease: EASE_LUXURY }}
              whileHover={{ y: -6 }}
              className="group card-editorial flex flex-col items-center text-center px-7 py-9"
            >
              <span className="badge-lav" aria-hidden>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[i % ICONS.length]}
                </svg>
              </span>

              <span className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-lav-600">
                {card.tag}
              </span>

              <h3 className="mt-3 font-display text-plum text-[1.35rem] md:text-[1.45rem] leading-[1.22] tracking-tight">
                {card.title}
              </h3>

              <span className="rule-bronze my-5" aria-hidden />

              <p className="text-[14px] leading-[1.75] text-editorial-body">{card.desc}</p>
            </motion.article>
          ))}
        </div>

        {/* The closing thought, centred under the cards — the line the client
            liked in the second mockup. */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.75, ease: EASE_LUXURY }}
          className="mt-14 max-w-3xl mx-auto text-center text-editorial-body text-[15px] md:text-[16px]"
        >
          {t("lead")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE_LUXURY }}
          className="mt-9 flex justify-center"
        >
          <Link
            href={`/${locale}/contact`}
            className="group inline-flex items-center justify-center gap-2.5 rounded-md bg-plum px-8 py-4 text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(46,31,82,0.2)] transition-all duration-300 hover:bg-lav-800 hover:-translate-y-0.5"
          >
            {t("cta")}
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
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
        </motion.div>
      </div>
    </section>
  );
}
