"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

const ICONS = [
  <g key="p">
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5.5 19.5c0-3.7 2.9-5.6 6.5-5.6s6.5 1.9 6.5 5.6" />
  </g>,
  <g key="g">
    <circle cx="9" cy="9" r="3" />
    <path d="M3.5 19c0-3 2.5-4.6 5.5-4.6s5.5 1.6 5.5 4.6" />
    <path d="M16 6.6a3 3 0 010 5.6M17.5 19c0-2.2-.9-3.7-2.3-4.6" opacity="0.55" />
  </g>,
  <g key="m">
    <path d="M12 3l8 4.5-8 4.5-8-4.5L12 3z" />
    <path d="M4 12l8 4.5 8-4.5M4 16.5L12 21l8-4.5" opacity="0.55" />
  </g>,
  <g key="c">
    <path d="M4 6.5h16v10H10l-4 3.5v-3.5H4z" />
    <path d="M8 10h8M8 13h5" />
  </g>,
  <g key="t">
    <path d="M5 6h9M5 12h9M5 18h9" />
    <circle cx="18.5" cy="6" r="1.3" />
    <circle cx="18.5" cy="12" r="1.3" />
    <circle cx="18.5" cy="18" r="1.3" />
  </g>,
  <g key="r">
    <path d="M12 3.5l2.5 5.4 5.8.8-4.2 4.1 1 5.8-5.1-2.8-5.1 2.8 1-5.8-4.2-4.1 5.8-.8L12 3.5z" />
  </g>,
];

const KEYS = [
  "personalization",
  "smallGroups",
  "methodology",
  "communication",
  "criticalThinking",
  "realLife",
] as const;

/**
 * "Τι αλλάζει στην πράξη" — in the reference this is not a wall of cards but a
 * plain row of marks: an icon, a bold two-line title, one sentence beneath, and
 * hairlines between the columns. Nothing is boxed and nothing is hidden.
 */
export default function DifferenceSection() {
  const t = useTranslations("difference");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <section className="relative py-20 md:py-24 px-5 sm:px-6 bg-editorial-paper overflow-hidden">
      <div ref={ref} className="max-w-6xl mx-auto">
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
            {t("title")}
          </motion.h2>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.28, ease: EASE_LUXURY }}
            className="rule-bronze mx-auto mt-5 origin-center"
            aria-hidden
          />
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12">
          {KEYS.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 26 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.09, ease: EASE_LUXURY }}
              className="group flex flex-col items-center px-6 text-center lg:[&:not(:nth-child(3n+1))]:border-l lg:border-[color:var(--editorial-line)]"
            >
              <span
                className="text-plum/60 transition-colors duration-400 group-hover:text-bronze"
                aria-hidden
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[i]}
                </svg>
              </span>

              <h3 className="mt-5 font-semibold text-plum text-[15px] leading-[1.4] tracking-tight max-w-[15rem]">
                {t(`features.${key}.title`)}
              </h3>

              <p className="mt-3 text-[13.5px] leading-[1.7] text-editorial-body max-w-[17rem]">
                {t(`features.${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
