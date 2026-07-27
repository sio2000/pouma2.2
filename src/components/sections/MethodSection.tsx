"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";
import { DimitraVideoGrid } from "@/components/sections/DimitraVideosSection";

export default function MethodSection() {
  const t = useTranslations("method");
  const tVideos = useTranslations("dimitraVideos");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const stages = t.raw("stages") as string[];

  return (
    <section className="relative py-16 md:py-20 px-6 overflow-hidden bg-section-elevated">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 w-[480px] h-[480px] rounded-full bg-lav-100/60 blur-3xl" />
        <div className="absolute bottom-0 -left-16 w-80 h-80 rounded-full bg-gold-200/30 blur-3xl" />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="w-8 h-px bg-gold-400/70" />
            <span className="text-eyebrow text-lav-600">{t("journeyLabel")}</span>
            <span className="w-8 h-px bg-gold-400/70" />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE_LUXURY }}
            className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-plum tracking-tight leading-[1.05]"
          >
            {t("label")}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stages.map((stage, i) => (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.12 + i * 0.1, ease: EASE_LUXURY }}
              whileHover={{
                y: -10,
                scale: 1.04,
                transition: { type: "spring", stiffness: 320, damping: 18 },
              }}
              className="group relative overflow-hidden rounded-2xl border border-lav-100 bg-white/90 backdrop-blur-sm p-6 shadow-soft cursor-default transition-[border-color,background-color,box-shadow] duration-300 hover:border-gold-400 hover:bg-gold-200/35 hover:shadow-gold-glow"
            >
              {/* Gold sweep that wipes across on hover */}
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-300/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                aria-hidden
              />
              {/* Top accent bar grows in on hover */}
              <span
                className="pointer-events-none absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-gold-400 to-gold-300 transition-transform duration-400 ease-out group-hover:scale-x-100"
                aria-hidden
              />
              <span className="method-num relative font-display text-3xl font-light leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="relative mt-4 font-medium text-base leading-snug text-plum transition-colors duration-300 group-hover:text-plum">
                {stage}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Compact video strip tucked symmetrically beneath the method cards —
            short, tappable glimpses of Δήμητρα, kept small so they support the
            cards rather than dominate the section. */}
        <div className="mt-12 md:mt-14">
          <div className="rule-ornament mb-6 w-fit mx-auto">{tVideos("label")}</div>
          <DimitraVideoGrid compact />
        </div>
      </div>
    </section>
  );
}
