"use client";
import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import PremiumButton from "@/components/ui/PremiumButton";
import { EASE_LUXURY } from "@/lib/motion";

type IntroCard = { title: string; desc: string };

/* One mark per feeling, in the order the cards name them: the thought that is
   already there, the voice that comes out smaller than it, and the freeze. */
const ICONS: ReactNode[] = [
  <g key="thought">
    <path d="M12 6.2v12.6" />
    <path d="M12 7.4a3 3 0 00-5.2 1.9A2.8 2.8 0 005.5 12c0 .9.4 1.7 1 2.2A2.8 2.8 0 009.3 18a2.7 2.7 0 002.7 1" />
    <path d="M12 7.4a3 3 0 015.2 1.9A2.8 2.8 0 0118.5 12c0 .9-.4 1.7-1 2.2A2.8 2.8 0 0114.7 18a2.7 2.7 0 01-2.7 1" />
  </g>,
  <g key="voice">
    <circle cx="10" cy="12" r="5.4" />
    <path d="M17.4 8.6a5.4 5.4 0 010 6.8" opacity="0.75" />
    <path d="M20.3 6.4a9 9 0 010 11.2" opacity="0.5" />
  </g>,
  <g key="freeze">
    <path d="M12 3.4v17.2M4.3 7.7l15.4 8.6M19.7 7.7L4.3 16.3" />
    <path d="M12 7.2 9.7 5.2M12 7.2l2.3-2M12 16.8l-2.3 2M12 16.8l2.3 2" opacity="0.7" />
  </g>,
];

/**
 * "Δεν χρειάζεσαι άλλη μία αρχή από το μηδέν" — the beat the client singled out
 * in her reference: one serif statement, its gold answer underneath, and three
 * small cards whose only job is to make the reader think "yes, that is me".
 * Kept deliberately compact — the previous cards read as three large buttons.
 */
export default function IntroSection() {
  const t = useTranslations("intro");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const cards = t.raw("cards") as IntroCard[];

  return (
    <section className="relative py-18 md:py-24 px-6 overflow-hidden bg-section-elevated">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 w-[480px] h-[480px] rounded-full bg-lav-100/60 blur-3xl" />
        <div className="absolute bottom-0 -left-16 w-80 h-80 rounded-full bg-gold-200/30 blur-3xl" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_LUXURY }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="w-8 h-px bg-gold-400/70" />
          <span className="text-eyebrow text-lav-600">{t("eyebrow")}</span>
          <span className="w-8 h-px bg-gold-400/70" />
        </motion.div>

        <div className="text-center max-w-3xl mx-auto">
          <div className="overflow-hidden pb-1">
            <motion.h2
              initial={{ y: "110%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
              className="text-display-xl text-plum text-[clamp(1.75rem,4vw,2.7rem)]"
            >
              {t("headline1")}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.28, ease: EASE_LUXURY }}
            className="mt-3 font-display text-gradient text-[clamp(1.15rem,2.3vw,1.6rem)] leading-snug"
          >
            {t("headline2")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 md:mt-14">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45 + i * 0.12, ease: EASE_LUXURY }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 320, damping: 18 },
              }}
              className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-lav-100 bg-white/90 backdrop-blur-sm px-6 py-8 text-center shadow-soft cursor-default transition-[border-color,background-color,box-shadow] duration-300 hover:border-gold-400 hover:bg-gold-200/40 hover:shadow-gold-glow"
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

              <span className="badge-lav badge-lav-sm relative" aria-hidden>
                <svg
                  width="24"
                  height="24"
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

              <h3 className="relative mt-5 font-display text-[1.22rem] md:text-[1.32rem] text-plum leading-[1.25] tracking-tight">
                {card.title}
              </h3>

              <span className="rule-bronze relative my-4" aria-hidden />

              <p className="relative text-[13.5px] leading-[1.7] text-editorial-body">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE_LUXURY }}
          className="mt-11 flex justify-center"
        >
          <PremiumButton
            href={`/${locale}/contact`}
            variant="gold"
            size="lg"
            className="rounded-full"
          >
            {t("cta")}
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </motion.svg>
          </PremiumButton>
        </motion.div>
      </div>
    </section>
  );
}
