"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

/**
 * The "gap" between the two reveal bands — a clever, attention-catching line
 * aimed at the prospective student, set on the light website background so the
 * two cinematic strips feel deliberately separated.
 */
export default function RevealBridge() {
  const t = useTranslations("bridge");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section className="bg-ivory px-6 py-16 md:py-24">
      <div ref={ref} className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_LUXURY }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="w-8 h-px bg-gold-400/70" />
          <span className="text-eyebrow text-lav-600">{t("eyebrow")}</span>
          <span className="w-8 h-px bg-gold-400/70" />
        </motion.div>

        <h2 className="font-display font-light tracking-tight leading-[1.12]">
          <motion.span
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.08, ease: EASE_LUXURY }}
            className="block text-plum text-[clamp(1.7rem,4.2vw,3rem)]"
          >
            {t("line1")}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_LUXURY }}
            className="block text-gradient text-[clamp(1.7rem,4.2vw,3rem)]"
          >
            {t("line2")}
          </motion.span>
        </h2>
      </div>
    </section>
  );
}
