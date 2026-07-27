"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function HeroPhotoPanel() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const founderName = locale === "el" ? "Δήμητρα Γιαννουπλάκη" : "Dimitra Giannouplaki";
  const facts = t.raw("aboutFacts") as string[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.25, ease: EASE_LUXURY }}
      className="relative w-full max-w-sm sm:max-w-md mx-auto lg:mx-0 lg:max-w-none"
    >
      {/* Soft decorative glow behind the frame */}
      <div className="absolute -top-10 -left-8 w-44 h-44 rounded-full bg-lav-400/25 blur-3xl -z-10" aria-hidden />
      <div className="absolute -bottom-6 -right-6 w-52 h-52 rounded-full bg-gold-400/20 blur-3xl -z-10" aria-hidden />

      {/* Framed photo — the "who I am" facts now live INSIDE the frame, as a
          frosted panel occupying the lower part of the image (client request). */}
      <div className="relative w-full">
        {/* Gradient hairline frame — a soft lavender→gold border */}
        <div className="relative w-full rounded-[2.2rem] p-[3px] bg-gradient-to-br from-lav-300/80 via-white/50 to-gold-300/80 shadow-strong">
          <div className="relative w-full overflow-hidden rounded-[2rem] ring-1 ring-white/50 aspect-[3/4]">
            <Image
              src="/newherosectionpik.png"
              alt={`${founderName} — The Pouma Academy`}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-cover object-top"
            />
            {/* Soft, shallow bottom gradient — only enough to keep the compact
                facts panel legible, without covering her body. */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-plum/80 via-plum/20 to-transparent" />

            {/* Top-left glass badge — two-word identity */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease: EASE_LUXURY }}
              className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/20 border border-white/35 backdrop-blur-xl px-3.5 py-2 shadow-soft"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold-300" aria-hidden />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white drop-shadow-sm">
                {t("photoBadge")}
              </span>
            </motion.div>

          </div>
        </div>

        {/* Frosted "who I am" panel — deliberately un-aligned: it hangs off the
            bottom-right of the frame, half inside / half outside the photo and
            tilted a touch, for a hand-placed, "tsalakomeno" feel (client req). */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE_LUXURY }}
          className="absolute -bottom-6 -right-4 left-6 sm:-right-6 sm:left-10 z-20 -rotate-2 rounded-xl bg-plum/35 border border-white/30 backdrop-blur-xl shadow-strong px-4 py-3"
        >
          {/* Name plate + label on one row, slightly off-kilter */}
          <div className="flex items-end justify-between gap-2 mb-2">
            <span className="font-display text-white text-base sm:text-lg leading-tight drop-shadow-[0_2px_10px_rgba(20,11,40,0.7)] -rotate-1">
              {founderName}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-100 whitespace-nowrap pb-0.5 rotate-1">
              {t("aboutLabel")}
            </span>
          </div>

          <ul className="space-y-1">
            {facts.map((fact, i) => (
              <motion.li
                key={fact}
                initial={{ opacity: 0, x: -12, rotate: [-0.8, 0.6, -0.4, 0.9][i % 4] }}
                animate={{ opacity: 1, x: 0, rotate: [-0.8, 0.6, -0.4, 0.9][i % 4] }}
                transition={{ duration: 0.5, delay: 0.65 + i * 0.09, ease: EASE_LUXURY }}
                className="flex items-start gap-1.5"
                style={{ marginLeft: `${(i % 2 === 0 ? 0 : 10) + (i === 3 ? 6 : 0)}px` }}
              >
                <span className="mt-[1px] flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-gold-300/90 text-plum">
                  <CheckIcon className="h-2 w-2" />
                </span>
                <span className="text-[12px] sm:text-[13px] leading-snug text-white/95 drop-shadow-[0_1px_6px_rgba(20,11,40,0.6)]">
                  {fact}
                </span>
              </motion.li>
            ))}
          </ul>

          <Link
            href={`/${locale}/about`}
            className="group mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-300 to-gold-500 px-4 py-1.5 text-[13px] font-bold text-plum shadow-gold-glow hover:from-gold-200 hover:to-gold-400 transition-colors -rotate-1"
          >
            {t("aboutMore")}
            <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
