"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import SectionLabel from "@/components/ui/SectionLabel";
import PremiumButton from "@/components/ui/PremiumButton";
import AtmosphericBackground from "@/components/ui/AtmosphericBackground";
import { EASE_LUXURY } from "@/lib/motion";

export default function AboutPage() {
  const t = useTranslations("about");
  const ctaT = useTranslations("cta");
  const locale = useLocale();

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const storyRef = useRef<HTMLDivElement>(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-10%" });
  const valRef = useRef<HTMLDivElement>(null);
  const valInView = useInView(valRef, { once: true, margin: "-10%" });
  const mRef = useRef<HTMLDivElement>(null);
  const mInView = useInView(mRef, { once: true });

  const sRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sRef,
    offset: ["start end", "end start"],
  });
  const cardY = useTransform(scrollYProgress, [0, 1], [-32, 32]);
  const portraitRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  const valueItems = t.raw("values.items") as { title: string; desc: string }[];

  return (
    <div className="bg-ivory min-h-screen">
      <AtmosphericBackground variant="hero" className="pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-28 px-4 sm:px-6">
        <div ref={heroRef} className="max-w-5xl mx-auto relative z-10">
          <SectionLabel variant="ornament">{t("hero.label")}</SectionLabel>

          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 90, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.15, delay: 0.1, ease: EASE_LUXURY }}
              className="text-display-xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-plum"
            >
              {t("hero.headline")}
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              initial={{ y: 90, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.15, delay: 0.18, ease: EASE_LUXURY }}
              className="text-display-xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gradient"
            >
              {t("hero.headline2")}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-display italic text-2xl md:text-3xl text-plum/40 max-w-2xl leading-snug border-l-2 border-lav-300/60 pl-8"
          >
            {t("hero.sub")}
          </motion.p>
        </div>
      </AtmosphericBackground>

      <section ref={sRef} className="py-16 sm:py-20 md:py-28 lg:py-36 px-4 sm:px-6 bg-section-elevated overflow-hidden">
        <div
          ref={storyRef}
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={storyInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.95, ease: EASE_LUXURY }}
          >
            <SectionLabel variant="ornament">{t("story.label")}</SectionLabel>
            <h2 className="font-display font-light text-3xl md:text-4xl lg:text-5xl text-plum mb-8 leading-snug tracking-tight">
              {t("story.headline")}
            </h2>
            <p className="text-body-premium text-lg mb-6">{t("story.body1")}</p>
            <p className="text-body-premium text-lg">{t("story.body2")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={storyInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.95, delay: 0.12, ease: EASE_LUXURY }}
            className="relative"
          >
            <motion.div style={{ y: cardY, rotate: portraitRotate }}>
              <div className="aspect-[4/5] max-w-md mx-auto lg:mx-0 rounded-[2rem] overflow-hidden shadow-strong relative ring-1 ring-lav-200/50">
                <Image
                  src="/dimitra.png"
                  alt={locale === "el" ? "Δήμητρα Γιαννουπλάκη" : "Dimitra Giannouplaki"}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 90vw, 420px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/75 via-plum/15 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 md:p-10 text-center pointer-events-none">
                  <p className="font-display text-2xl md:text-3xl text-white/90 leading-tight mb-2 drop-shadow-sm">
                    {locale === "el" ? "Δήμητρα Γιαννουπλάκη" : "Dimitra Giannouplaki"}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                    {locale === "el"
                      ? "Ιδρύτρια & Communication Coach"
                      : "Founder & Communication Coach"}
                  </p>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="max-lg:relative max-lg:mt-4 max-lg:inline-block max-lg:mx-2 lg:absolute lg:-bottom-6 lg:-right-2 xl:right-4 glass rounded-2xl px-6 py-4 shadow-medium"
              >
                <p className="text-eyebrow text-plum/35 mb-1">
                  {locale === "el" ? "Εμπειρία" : "Experience"}
                </p>
                <p className="font-display text-2xl text-plum">19</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="max-lg:relative max-lg:mt-3 max-lg:inline-block max-lg:mx-2 lg:absolute lg:-top-5 lg:-left-2 glass rounded-2xl px-5 py-3 shadow-medium border border-gold-200/40"
              >
                <p className="text-eyebrow text-plum/35 mb-1">
                  {locale === "el" ? "Μεταμορφώσεις" : "Transformations"}
                </p>
                <p className="font-display text-2xl text-plum">3.500+</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20 md:py-28 lg:py-40 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-lav-100/60 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gold-200/25 blur-3xl" />
        </div>

        <div ref={valRef} className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={valInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
            className="text-center mb-14 md:mb-20"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-10 h-px bg-lav-400/70" />
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              <span className="w-10 h-px bg-lav-400/70" />
            </div>
            <h2 className="font-display font-light text-4xl md:text-5xl lg:text-[3.25rem] text-plum tracking-tight leading-tight">
              {t("values.label")}
            </h2>
          </motion.div>

          <div className="relative">
            <div
              className="absolute left-[1.125rem] md:left-6 top-3 bottom-3 w-px bg-gradient-to-b from-lav-200 via-lav-400/60 to-lav-200"
              aria-hidden
            />

            <div className="space-y-6 md:space-y-8">
              {valueItems.map((item, i) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={valInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.75,
                    delay: 0.12 + i * 0.1,
                    ease: EASE_LUXURY,
                  }}
                  className="relative pl-12 md:pl-16"
                >
                  <span
                    className="absolute left-0 top-6 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border-2 border-lav-300 shadow-soft flex items-center justify-center"
                    aria-hidden
                  >
                    <span className="w-2 h-2 rounded-full bg-lav-500" />
                  </span>

                  <div className="rounded-2xl md:rounded-3xl border border-lav-100/90 bg-white/90 backdrop-blur-sm p-7 md:p-9 shadow-soft hover:shadow-medium hover:border-lav-200/80 transition-all duration-400 group">
                    <h3 className="font-display text-2xl md:text-[1.65rem] text-plum mb-3 tracking-tight leading-snug group-hover:text-lav-700 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-body-premium text-base leading-relaxed border-l-2 border-lav-200/80 pl-4 ml-0.5">
                      {item.desc}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="legacy-palette py-32 md:py-40 px-6 relative overflow-hidden bg-dark-section">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-lav-700/22 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gold-400/8 blur-3xl" />
        </div>
        <div ref={mRef} className="max-w-3xl mx-auto text-center relative z-10">
          <SectionLabel variant="dark">{t("mission.label")}</SectionLabel>
          <div className="overflow-hidden">
            <motion.blockquote
              initial={{ y: 70, opacity: 0 }}
              animate={mInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.15, delay: 0.15, ease: EASE_LUXURY }}
              className="font-display italic text-3xl md:text-4xl lg:text-5xl text-white/95 leading-snug tracking-tight"
            >
              &ldquo;{t("mission.quote")}&rdquo;
            </motion.blockquote>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 text-center bg-ivory">
        <PremiumButton href={`/${locale}/contact`} variant="primary" size="lg">
          {ctaT("primary")}
        </PremiumButton>
      </section>
    </div>
  );
}
