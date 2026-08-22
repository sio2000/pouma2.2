"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  CompassIcon,
  QuoteBubbleIcon,
  StarBubbleIcon,
  FlagIcon,
} from "@/components/home/HomeIcons";
import { EASE_LUXURY } from "@/lib/motion";

type Step = { title: string; desc: string };

const STEP_ICONS = [CompassIcon, QuoteBubbleIcon, StarBubbleIcon, FlagIcon];

/**
 * "The Pouma Speaking Method" — the dark band in the middle of the page. Four
 * medallions on one dashed line, each with its number set in a small brass disc
 * on the shoulder, and one sentence explaining what actually happens at that
 * stage. The client asked for each step to be explained, not just named.
 */
export default function SpeakingMethodSection() {
  const t = useTranslations("home.method");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const steps = t.raw("steps") as Step[];

  return (
    <section className="relative overflow-hidden bg-home-ink py-14 md:py-18">
      <div ref={ref} className="home-container">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
          className="home-display text-center text-white text-[clamp(1.7rem,3.2vw,2.35rem)]"
        >
          {t("title")}
        </motion.h2>

        <div className="relative mt-12">
          {/* The dashed route the four stages sit on. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.35, ease: EASE_LUXURY }}
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[2.1rem] hidden border-t border-dashed border-[color:var(--home-brass)]/40 md:block"
            aria-hidden
          />

          <ol className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 md:grid-cols-4 md:gap-y-0">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 26 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.75, delay: 0.4 + i * 0.13, ease: EASE_LUXURY }}
                  className="home-card-dark group flex flex-col items-center rounded-2xl border border-transparent px-4 pb-6 pt-2 text-center md:px-6"
                >
                  <span className="relative">
                    <span
                      className={`home-medallion h-[4.4rem] w-[4.4rem] bg-[color:var(--home-ink)] ${
                        i === 0 ? "medallion-white" : ""
                      }`}
                    >
                      <Icon className="h-8 w-8" />
                    </span>
                    {/* The number, on the shoulder of the medallion. */}
                    <span className="absolute -right-2 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--home-brass)]/70 bg-[color:var(--home-ink-deep)] font-display text-[13px] text-brass-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>

                  <h3 className="home-display mt-6 text-[1.24rem] italic text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-[14.5px] leading-[1.7] text-white/75">{step.desc}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
