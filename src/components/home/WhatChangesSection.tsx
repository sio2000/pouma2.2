"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  QuoteBubbleIcon,
  MindIcon,
  SpeakWavesIcon,
  StarIcon,
} from "@/components/home/HomeIcons";
import { EASE_LUXURY } from "@/lib/motion";

type Change = { title: string; desc: string };

const ICONS = [QuoteBubbleIcon, MindIcon, SpeakWavesIcon, StarIcon];

/**
 * "Τι αλλάζει στην πράξη όταν δουλεύουμε μαζί" — the proof beat from the
 * client's reference: four outcomes in a row, each under a round lavender
 * medallion, separated by hairlines rather than boxed in cards. It answers the
 * question the programmes raise: what is actually different afterwards.
 */
export default function WhatChangesSection() {
  const t = useTranslations("home.whatChanges");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const items = t.raw("items") as Change[];

  return (
    <section className="relative overflow-hidden bg-home-paper py-12 md:py-16">
      <div ref={ref} className="home-container">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
          className="home-display text-center text-[color:var(--home-ink)] text-[clamp(1.7rem,3.2vw,2.35rem)]"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.14, ease: EASE_LUXURY }}
          className="mt-4 text-center text-[16px] italic text-brass"
        >
          {t("lead")}
        </motion.p>

        <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 26 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: EASE_LUXURY }}
                className="group flex flex-col items-center px-6 text-center lg:[&:not(:first-child)]:border-l lg:border-[color:var(--home-line)]"
              >
                <span className="badge-lav h-[3.4rem] w-[3.4rem]">
                  <Icon className="h-7 w-7" />
                </span>

                <h3 className="home-display mt-5 text-[1.1rem] leading-[1.3] text-[color:var(--home-ink)]">
                  {item.title}
                </h3>

                <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--home-ink)]/65">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
