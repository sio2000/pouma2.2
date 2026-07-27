"use client";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";

export default function PhilosophySection() {
  const t = useTranslations("philosophy");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const sRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const stats = [
    { v: t("stat1Value"), l: t("stat1Label") },
    { v: t("stat2Value"), l: t("stat2Label") },
    { v: t("stat3Value"), l: t("stat3Label") },
  ];

  return (
    <section ref={sRef} className="relative py-16 md:py-20 overflow-hidden bg-white">
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-48 -right-32 w-[600px] h-[600px] rounded-full bg-lav-50 blur-3xl opacity-90" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-gold-200/30 blur-3xl" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 xl:gap-28 items-center">

          {/* Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="rule-ornament mb-8 w-fit"
            >
              {t("label")}
            </motion.div>

            <div className="overflow-hidden mb-1">
              <motion.h2
                initial={{ y: 70, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-plum leading-[1.03] tracking-tight"
              >
                {t("headline")}
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h2
                initial={{ y: 70, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-gradient leading-[1.03] tracking-tight"
              >
                {t("headline2")}
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-plum/50 text-lg leading-relaxed max-w-md"
            >
              {t("body")}
            </motion.p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-10 lg:pl-14 lg:border-l border-lav-100">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="font-display text-5xl md:text-6xl text-gradient font-light leading-none mb-2">{s.v}</div>
                <div className="text-sm text-plum/40 leading-snug tracking-wide">{s.l}</div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-4 h-px w-10 bg-gradient-to-r from-lav-500 to-transparent origin-left"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
