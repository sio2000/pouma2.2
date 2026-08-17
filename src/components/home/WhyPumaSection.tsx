"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import PumaSilhouette from "@/components/puma/PumaSilhouette";
import {
  LotusIcon,
  EyeIcon,
  MountainIcon,
  ShieldIcon,
  PrecisionIcon,
} from "@/components/home/HomeIcons";
import { EASE_LUXURY } from "@/lib/motion";

type Trait = { title: string; desc: string };

const TRAIT_ICONS = [LotusIcon, EyeIcon, MountainIcon, ShieldIcon, PrecisionIcon];

/**
 * "Γιατί Pouma;" — the animal drawn on the left in a single brass line over a
 * faint geometric grid, the meaning on the right. Five traits sit in a row
 * underneath, then one sentence brings it back to the reader.
 */
export default function WhyPumaSection() {
  const t = useTranslations("home.whyPuma");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const traits = t.raw("traits") as Trait[];

  return (
    <section className="relative overflow-hidden bg-home-paper">
      <div className="home-container grid grid-cols-1 items-center gap-10 py-14 md:py-18 lg:grid-cols-[36%_64%] lg:gap-8">
        {/* The drawing. A faint compass grid sits behind it, as in the
            reference, so the animal reads as an engraving rather than a logo. */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.1, ease: EASE_LUXURY }}
          className="relative order-2 lg:order-1"
          aria-hidden
        >
          <svg
            viewBox="0 0 400 400"
            className="pointer-events-none absolute inset-0 h-full w-full text-[color:var(--home-brass)]/25"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
          >
            <circle cx="200" cy="185" r="150" />
            <circle cx="200" cy="185" r="110" />
            <path d="M50 185h300M200 35v300M94 79l212 212M306 79L94 291" />
          </svg>
          {/* Drawn as a brass outline rather than a filled shape, so it reads
              as the engraving in the reference. The silhouette takes its colour
              from the brand gold variables, so they are re-pointed at the
              homepage brass just for this instance. */}
          <div
            className="relative px-6 lg:px-0"
            style={
              {
                "--color-gold-300": "var(--home-brass-soft)",
                "--color-gold-400": "var(--home-brass)",
                "--color-lav-500": "var(--home-brass)",
              } as React.CSSProperties
            }
          >
            <PumaSilhouette gradientId="why-puma-home" variant="outline" />
          </div>
        </motion.div>

        <div ref={ref} className="order-1 lg:order-2">
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE_LUXURY }}
            className="home-display text-center text-[color:var(--home-ink)] text-[clamp(1.7rem,3.2vw,2.35rem)] lg:text-left"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_LUXURY }}
            className="mt-5 max-w-2xl text-center text-[16.5px] leading-[1.8] text-[color:var(--home-ink)]/72 lg:text-left"
          >
            {t("lead")}
          </motion.p>

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {traits.map((trait, i) => {
              const Icon = TRAIT_ICONS[i % TRAIT_ICONS.length];
              return (
                <motion.div
                  key={trait.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.28 + i * 0.09, ease: EASE_LUXURY }}
                  className="group flex flex-col items-center text-center"
                >
                  <Icon className="h-8 w-8 text-brass" />
                  <h3 className="mt-4 text-[15px] font-semibold text-[color:var(--home-ink)]">
                    {trait.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-[color:var(--home-ink)]/68">
                    {trait.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.8, ease: EASE_LUXURY }}
            className="mt-10 text-center text-[16.5px] italic text-[color:var(--home-ink)]/80 lg:text-left"
          >
            {t("closing")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
