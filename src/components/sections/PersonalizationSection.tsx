"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import PremiumButton from "@/components/ui/PremiumButton";

export default function PersonalizationSection() {
  const t = useTranslations("personalization");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  const items = t.raw("items") as { title: string; desc: string }[];
  const cardSteps = t.raw("cardSteps") as string[];

  return (
    <section className="relative py-16 md:py-20 px-6 bg-ivory overflow-hidden">
      <div className="absolute inset-0 pointer-events-none dot-grid opacity-[0.018]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative w-full max-w-sm mx-auto">
              <div
                className="rounded-3xl bg-gradient-to-br from-plum-mid via-lav-900 to-lav-800 overflow-hidden shadow-strong relative"
                style={{ minHeight: 360 }}
              >
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-lav-700/30 blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-gold-400/8 blur-2xl" />
                </div>
                <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full" style={{ minHeight: 360 }}>
                  <div>
                    <div className="text-[10px] font-bold text-lav-300 tracking-[0.22em] uppercase mb-4">
                      {t("cardLabel")}
                    </div>
                    <div className="space-y-3">
                      {cardSteps.map((step, i) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -16 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.3 + i * 0.09, duration: 0.5 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-5 h-5 rounded-full bg-lav-600/50 flex items-center justify-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-lav-300" />
                          </div>
                          <span className="text-white/65 text-sm">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/8">
                    <p className="font-display italic text-gold-300 text-lg leading-snug">{t("cardQuote")}</p>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute max-lg:static max-lg:mt-4 max-lg:mx-auto max-lg:w-fit max-lg:[animation:none] lg:-top-5 lg:-right-5 glass rounded-2xl px-5 py-3 shadow-medium border border-lav-200/50"
              >
                <div className="text-[10px] font-bold text-plum/35 uppercase tracking-widest mb-1">
                  {t("groupSizeLabel")}
                </div>
                <div className="font-display text-2xl text-plum font-medium">{t("groupSize")}</div>
              </motion.div>
            </div>
          </motion.div>

          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
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
                className="font-display font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-plum leading-[1.03] tracking-tight"
              >
                {t("headline")}
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h2
                initial={{ y: 70, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gradient leading-[1.03] tracking-tight"
              >
                {t("headline2")}
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.32 }}
              className="text-plum/50 text-lg leading-relaxed mb-10 max-w-md"
            >
              <span className="font-semibold text-plum/75">{t("bodyLead")}</span>{" "}
              {t("body")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mb-12"
            >
              <PremiumButton href={`/${locale}/programs`} variant="primary" size="lg">
                {t("learnMore")}
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </PremiumButton>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.38 + i * 0.09 }}
                  className="p-5 rounded-2xl bg-white border border-lav-100/80 shadow-soft hover:border-lav-300/60 hover:shadow-medium transition-all duration-400 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-lav-100 flex items-center justify-center mb-3 group-hover:bg-lav-600 transition-colors duration-300">
                    <div className="w-2 h-2 rounded-full bg-lav-500 group-hover:bg-white transition-colors duration-300" />
                  </div>
                  <h4 className="font-semibold text-plum text-sm mb-1 tracking-tight">{item.title}</h4>
                  <p className="text-plum/45 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
