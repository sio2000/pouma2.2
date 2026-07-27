"use client";
import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import PremiumButton from "@/components/ui/PremiumButton";
import { EASE_LUXURY } from "@/lib/motion";

type IntroCard = { tag: string; title: string; desc: string };

const ICONS: ReactNode[] = [
  <g key="who">
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5.5 19.5c0-3.7 2.9-5.6 6.5-5.6s6.5 1.9 6.5 5.6" />
  </g>,
  <g key="problem">
    <rect x="5" y="11" width="14" height="9" rx="2.2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </g>,
  <g key="how">
    <rect x="5" y="11" width="14" height="9" rx="2.2" />
    <path d="M8 11V8a4 4 0 0 1 7.4-1.9" />
  </g>,
];

export default function IntroSection() {
  const t = useTranslations("intro");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const cards = t.raw("cards") as IntroCard[];

  return (
    <section className="relative py-20 md:py-28 px-6 overflow-hidden bg-section-elevated">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 w-[480px] h-[480px] rounded-full bg-lav-100/60 blur-3xl" />
        <div className="absolute bottom-0 -left-16 w-80 h-80 rounded-full bg-gold-200/30 blur-3xl" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_LUXURY }}
          className="flex items-center justify-center gap-3 mb-7"
        >
          <span className="w-8 h-px bg-gold-400/70" />
          <span className="text-eyebrow text-lav-600">{t("eyebrow")}</span>
          <span className="w-8 h-px bg-gold-400/70" />
        </motion.div>

        <div className="text-center max-w-3xl mx-auto">
          <div className="overflow-hidden">
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

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.4, ease: EASE_LUXURY }}
            className="text-body-premium text-lg md:text-xl mt-7 max-w-2xl mx-auto"
          >
            {t("lead")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 mt-14 md:mt-16">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.14, ease: EASE_LUXURY }}
              whileHover={{
                y: -10,
                scale: 1.03,
                transition: { type: "spring", stiffness: 320, damping: 18 },
              }}
              className="group relative overflow-hidden rounded-2xl border border-lav-100 bg-white/90 backdrop-blur-sm p-7 md:p-8 shadow-soft cursor-default transition-[border-color,background-color,box-shadow] duration-300 hover:border-gold-400 hover:bg-gold-200/40 hover:shadow-gold-glow"
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

              <div className="relative flex items-center justify-between gap-4 mb-6">
                <span
                  className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-200/70 to-lav-100 border border-gold-300/50 ring-1 ring-gold-200/50 text-gold-500 shadow-soft transition-colors duration-300 group-hover:from-gold-300/80 group-hover:text-gold-600"
                  aria-hidden
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {ICONS[i % ICONS.length]}
                  </svg>
                </span>
                <span
                  className="method-num font-display text-[3.4rem] font-light leading-none tracking-tight"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <span className="relative inline-flex rounded-full bg-lav-50 text-lav-700 border border-lav-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] mb-4 transition-colors duration-300 group-hover:bg-gold-200/60 group-hover:text-gold-600 group-hover:border-gold-300/60">
                {card.tag}
              </span>

              <h3 className="relative font-display text-[1.6rem] md:text-[1.8rem] text-plum leading-[1.1] mb-3 tracking-tight">
                {card.title}
              </h3>
              <p className="relative text-[15px] leading-7 text-plum/65">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.95, ease: EASE_LUXURY }}
          className="mt-12 flex justify-center"
        >
          <PremiumButton
            href={`/${locale}/contact`}
            variant="gold"
            size="lg"
            className="rounded-full px-12 py-6 text-lg sm:text-xl tracking-wide shadow-gold-glow"
          >
            {t("cta")}
            <motion.svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              animate={{ x: [0, 5, 0] }}
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
