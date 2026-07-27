"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import HeroWorkshopButton from "@/components/sections/hero/HeroWorkshopButton";
import PumaHeroBackdrop from "@/components/puma/PumaHeroBackdrop";
import {
  StarIcon,
  LiveIcon,
  GroupIcon,
  NoteIcon,
} from "@/components/sections/hero/HeroTrustIcons";
import { EASE_LUXURY } from "@/lib/motion";

const TRUST_ICONS = [StarIcon, GroupIcon, LiveIcon, NoteIcon];

const Chevron = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M9 5l7 7-7 7" />
  </svg>
);

/**
 * The editorial hero, rebuilt to the client-approved mockups (ag / ag2).
 *
 * The photograph is no longer a framed portrait floating on the canvas — it is
 * the right half of the spread, bleeding to the edges of the section and
 * feathering into the ivory background, exactly as in the reference. All the
 * copy sits calmly on the left: a two-line eyebrow, a three-line serif
 * headline, one paragraph, two buttons and a hairline trust strip. The founder
 * plate rides low over the photograph so the reader meets the person last.
 */
export default function HeroSection() {
  const tHero = useTranslations("hero");
  const tBrand = useTranslations("brand");
  const tEnglish = useTranslations("english");
  const locale = useLocale();

  const founderName = locale === "el" ? "Δήμητρα Γιαννουπλάκη" : "Dimitra Giannouplaki";
  const facts = tHero.raw("aboutFacts") as string[];

  /* The portrait, wrapped in the tonal treatment that lets a warm-lit photo sit
     on an ivory page: a plum wash to pull the reds toward the brand, then long
     gradients that dissolve the hard edges of the frame into the canvas. */
  const photo = (feathered: boolean) => (
    <>
      <Image
        src="/newherosectionpik.png"
        alt={`${founderName} — ${tBrand("name")}`}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 52vw"
        className="object-cover object-center saturate-[0.85] contrast-[1.03]"
      />
      {/* Tonal wash — unifies the photograph with the plum/bronze palette. */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-plum/35 via-lav-900/12 to-gold-500/10 mix-blend-multiply"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[color:var(--editorial-cream)]/12" aria-hidden />
      {feathered && (
        <>
          {/* Left edge dissolves into the ivory column so there is no frame. */}
          <div
            className="absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-[color:var(--editorial-cream)] via-[color:var(--editorial-cream)]/72 to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[color:var(--editorial-cream)] to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[color:var(--editorial-cream-deep)] via-[color:var(--editorial-cream)]/55 to-transparent"
            aria-hidden
          />
        </>
      )}
    </>
  );

  /* The founder plate. White, quiet, one bronze hairline — the mockup's
     "this is who is speaking to you" moment, kept as the last thing read. */
  const founderPlate = (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.75, ease: EASE_LUXURY }}
      className="card-editorial px-6 py-5 sm:px-7 sm:py-6"
    >
      <p className="font-display text-[1.28rem] sm:text-[1.4rem] leading-tight text-plum tracking-tight">
        {founderName}
      </p>
      <p className="mt-1.5 text-[13px] leading-snug text-editorial-body">
        {tHero("photoBadge")} · {tHero("founderCredential")}
      </p>
      <span className="rule-bronze my-4" aria-hidden />
      <p className="text-[13px] font-medium text-lav-700">
        {tHero("founderEyebrow")}, {tBrand("name")}
      </p>
      <p className="font-script text-[1.5rem] leading-none text-bronze mt-2.5">{founderName}</p>
      <Link
        href={`/${locale}/about`}
        className="group/link mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-lav-700 hover:text-plum transition-colors"
      >
        {tHero("aboutMore")}
        <Chevron className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
      </Link>
    </motion.div>
  );

  return (
    <section
      id="hero"
      className="relative w-full bg-editorial overflow-hidden pt-32 sm:pt-36 lg:pt-36 pb-0 lg:min-h-[94svh] lg:flex lg:items-center"
    >
      <PumaHeroBackdrop />

      {/* DESKTOP — the photograph is the right half of the spread, full bleed:
          anchored to the bottom-right corner and feathered on every edge, so it
          reads as part of the page rather than a picture placed on it. The box
          carries the photo's own 599:758 ratio, so nothing of her is cropped —
          the whole frame is shown, only its edges dissolve into the ivory. */}
      <div
        className="hidden lg:block absolute bottom-0 right-0 h-[94%] w-auto aspect-[599/758] max-w-[52%] z-0"
        aria-hidden
      >
        {photo(true)}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="lg:max-w-[48%] xl:max-w-[46%] lg:pb-14">
          <HeroWorkshopButton />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
            className="eyebrow-editorial max-w-sm"
          >
            {tEnglish("badge")}
          </motion.p>

          {/* Three-line serif headline — the rhythm the client responded to. */}
          <div className="mt-6 space-y-1">
            {[tHero("headline1"), tHero("headline2"), tHero("headline3")].map((line, i) => (
              <div key={line} className="overflow-hidden pb-1">
                <motion.h1
                  initial={{ y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.12 + i * 0.1, ease: EASE_LUXURY }}
                  className={`font-display font-light tracking-[-0.02em] leading-[1.08] text-[clamp(2.1rem,4.4vw,3.5rem)] ${
                    i === 2 ? "text-gradient" : "text-plum"
                  }`}
                >
                  {line}
                </motion.h1>
              </div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE_LUXURY }}
            className="mt-6 max-w-xl text-editorial-body text-[clamp(0.98rem,1.15vw,1.08rem)]"
          >
            {tHero("subtext")}
          </motion.p>

          {/* Buttons — a filled plum rectangle and its outlined twin, as drawn. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.58, ease: EASE_LUXURY }}
            className="mt-9 flex flex-col sm:flex-row gap-3.5"
          >
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center justify-center gap-2.5 rounded-md bg-plum px-7 py-4 text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(46,31,82,0.22)] transition-all duration-300 hover:bg-lav-800 hover:shadow-[0_14px_34px_rgba(46,31,82,0.3)] hover:-translate-y-0.5"
            >
              {tHero("freeAssessment")}
              <Chevron className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={`/${locale}/programs`}
              className="group inline-flex items-center justify-center gap-2.5 rounded-md border border-plum/35 bg-white/40 px-7 py-4 text-[15px] font-semibold text-plum backdrop-blur-sm transition-all duration-300 hover:border-plum hover:bg-white hover:-translate-y-0.5"
            >
              {tHero("programsLabel")}
              <Chevron className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

        </div>

        {/* Trust strip — four proofs, each in its own card, back on the gold
            treatment the brand already uses: gold icon tile, gold sweep and a
            gold border + glow on hover. */}
        <motion.ul
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.72, ease: EASE_LUXURY }}
          className="mt-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4 lg:max-w-[72%] xl:max-w-[70%]"
        >
          {facts.map((fact, i) => {
            const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
            return (
              <motion.li
                key={fact}
                whileHover={{
                  y: -6,
                  transition: { type: "spring", stiffness: 320, damping: 18 },
                }}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-lav-100 bg-white/90 px-4 py-4 shadow-soft backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-gold-400 hover:bg-gold-200/40 hover:shadow-gold-glow"
              >
                {/* Gold sweep that wipes across on hover */}
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-300/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  aria-hidden
                />
                {/* Top accent bar grows in on hover */}
                <span
                  className="pointer-events-none absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-gold-400 to-gold-300 transition-transform duration-400 ease-out group-hover:scale-x-100"
                  aria-hidden
                />
                <span
                  className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold-300/50 bg-gradient-to-br from-gold-200/70 to-lav-100 text-gold-500 ring-1 ring-gold-200/50 shadow-soft transition-colors duration-300 group-hover:from-gold-300/80 group-hover:text-gold-600"
                  aria-hidden
                >
                  <Icon className="h-[21px] w-[21px]" />
                </span>
                <span className="relative text-[12px] leading-[1.35] text-plum/75">{fact}</span>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* MOBILE — the same photograph, still frameless, as a full-bleed band. */}
        <div className="lg:hidden relative -mx-5 sm:-mx-6 mt-10 aspect-[599/758]">
          {photo(false)}
          <div
            className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[color:var(--editorial-cream)] to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[color:var(--editorial-cream-deep)] to-transparent"
            aria-hidden
          />
        </div>

        <div className="lg:hidden relative -mt-16 pb-14">{founderPlate}</div>
      </div>

      {/* The plate rides over the photograph on desktop and runs off the right
          edge of the page, the way it does in the reference. */}
      <div className="hidden lg:block absolute bottom-16 right-0 z-20 w-[24rem] xl:w-[26rem]">
        <div className="rounded-l-xl overflow-hidden">{founderPlate}</div>
      </div>
    </section>
  );
}
