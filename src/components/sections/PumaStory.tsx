"use client";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import PumaSilhouette from "@/components/puma/PumaSilhouette";

/**
 * "Η φιλοσοφία του Pouma" — the horizontal plum band that closes the page, and
 * the piece the client called the best thing in the mockups: one deep purple
 * strip running the full width, the puma bleeding off the LEFT edge and facing
 * into the copy, the words sitting quietly on the right. No card, no frame —
 * the animal dissolves into the colour.
 */
export default function PumaStory() {
  const t = useTranslations("puma");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const sRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sRef, offset: ["start end", "end start"] });
  const pumaX = useTransform(scrollYProgress, [0, 1], [-40, 24]);
  const orbY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [16, -16]);

  const paras = [t("p1"), t("p2"), t("p3"), t("p4"), t("p5")];

  return (
    <section
      id="puma"
      ref={sRef}
      className="relative overflow-hidden bg-plum scroll-mt-24"
    >
      {/* Ambient depth behind the band. */}
      <motion.div
        style={{ y: orbY }}
        className="pointer-events-none absolute -top-24 right-0 h-[560px] w-[560px]"
        aria-hidden
      >
        <div className="h-full w-full rounded-full bg-radial from-lav-600/25 via-lav-800/8 to-transparent blur-3xl" />
      </motion.div>

      {/* The puma — anchored to the left edge, facing the text, feathering into
          the plum on its right side so it never reads as a picture in a box. */}
      <motion.div
        style={{ x: pumaX }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-y-0 left-0 flex w-[92%] items-center lg:w-[46%]"
        aria-hidden
      >
        <div className="relative w-full -ml-[6%]">
          <div className="absolute inset-0 -z-10 bg-radial from-gold-400/16 to-transparent blur-3xl" />
          <div className="opacity-25 lg:opacity-90">
            <PumaSilhouette gradientId="puma-band" />
          </div>
          {/* Breathing eye — the power watching from the dark. */}
          <motion.span
            className="absolute left-[89%] top-[50.5%] h-2.5 w-2.5 rounded-full bg-gold-200"
            style={{ boxShadow: "0 0 22px 7px color-mix(in srgb, var(--color-gold-300) 80%, transparent)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: [0.4, 1, 0.4] } : {}}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          />
        </div>
        {/* Right-edge dissolve into the band. */}
        <div className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-plum via-plum/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-plum to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[42%_58%]">
          <div aria-hidden className="hidden lg:block" />

          <motion.div
            ref={ref}
            style={{ y: textY }}
            className="py-20 md:py-24 lg:py-28 lg:pl-10"
          >
            <motion.p
              initial={{ opacity: 0, x: -18 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lav-300"
            >
              {t("label")}
            </motion.p>

            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 font-display font-light text-white tracking-[-0.02em] leading-[1.08] text-[clamp(2rem,4.4vw,3.1rem)]"
            >
              {t("headline")} {t("headline2")}
            </motion.h2>

            <motion.span
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rule-bronze mt-6 origin-left"
              aria-hidden
            />

            <div className="mt-8 space-y-5 max-w-2xl">
              {paras.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.28 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  className={`text-[15px] md:text-base leading-[1.85] font-light ${
                    i === paras.length - 1 ? "text-white/90 font-normal" : "text-white/62"
                  }`}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* The three closing lines, held together by a single bronze rule. */}
            <motion.blockquote
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 max-w-2xl border-l-2 border-[color:var(--editorial-bronze)] pl-6 space-y-4"
            >
              <p className="font-display italic text-gold-300 text-[1.15rem] md:text-[1.35rem] leading-snug">
                {t("quote1")}
              </p>
              <p className="text-[14.5px] md:text-[15px] leading-[1.8] text-white/65">{t("quote2")}</p>
              <p className="text-[14.5px] md:text-[15px] leading-[1.8] text-white/65">{t("quote3")}</p>
            </motion.blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
