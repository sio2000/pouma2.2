"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  BriefcaseIcon,
  GrowthIcon,
  ChatIcon,
  CompassIcon,
} from "@/components/home/HomeIcons";
import { EASE_LUXURY } from "@/lib/motion";

type Affect = { text: string; image: string; alt: string };

const ICONS = [BriefcaseIcon, GrowthIcon, ChatIcon, CompassIcon];

/**
 * "Αυτό σε αφορά αν…" — four photographs in a row, each darkened at the foot
 * so the line of copy can sit on it, each crowned by a brass medallion that
 * breaks the top edge. This is the beat where the reader recognises herself.
 */
export default function AffectsSection() {
  const t = useTranslations("home.affects");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const items = t.raw("items") as Affect[];

  return (
    <section className="relative overflow-hidden bg-home-paper px-5 py-20 sm:px-6 md:py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
          className="home-display text-center text-[color:var(--home-ink)] text-[clamp(1.9rem,4.2vw,2.9rem)]"
        >
          {t("title")}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE_LUXURY }}
          className="home-ornament mt-6"
          aria-hidden
        >
          <span className="block h-1.5 w-1.5 rotate-45 bg-[color:var(--home-brass)]" />
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.article
                key={item.text}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease: EASE_LUXURY }}
                whileHover={{ y: -8 }}
                className="group relative pt-7"
              >
                {/* Medallion, half in and half out of the photograph. */}
                <span className="home-medallion absolute left-1/2 top-0 z-20 h-14 w-14 -translate-x-1/2 bg-[#241733]">
                  <Icon className="h-6 w-6" />
                </span>

                <div className="relative h-[19rem] overflow-hidden rounded-xl shadow-[0_18px_44px_rgba(36,22,64,0.16)] ring-1 ring-[color:var(--home-line)]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                  {/* Warm sepia unifier + the reading gradient at the foot. */}
                  <div className="absolute inset-0 bg-[color:var(--home-brass)]/18 mix-blend-multiply" aria-hidden />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241733] via-[#241733]/55 to-transparent" aria-hidden />

                  <p className="absolute inset-x-0 bottom-0 p-5 text-[13.5px] leading-[1.6] text-white/92">
                    {item.text}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
