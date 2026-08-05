"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import HeroWorkshopButton from "@/components/sections/hero/HeroWorkshopButton";
import PumaHeroBackdrop from "@/components/puma/PumaHeroBackdrop";
import {
  GlobeIcon,
  GroupIcon,
  SpeakIcon,
  ChatIcon,
} from "@/components/sections/hero/HeroTrustIcons";
import { EASE_LUXURY } from "@/lib/motion";

/* One mark per proof, matched to what it actually says: the countries, the
   small group, speaking over drills, talking from day one. */
const TRUST_ICONS = [GlobeIcon, GroupIcon, SpeakIcon, ChatIcon];

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
          {/* Left edge dissolves into the ivory column so there is no frame.
              Kept short now that the frame itself is small, so the fade softens
              the edge without eating into her. */}
          <div
            className="absolute inset-y-0 left-0 w-[38%] bg-gradient-to-r from-[color:var(--editorial-cream)] via-[color:var(--editorial-cream)]/62 to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[color:var(--editorial-cream)] to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[color:var(--editorial-cream-deep)] via-[color:var(--editorial-cream)]/50 to-transparent"
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
      className="card-editorial px-5 py-4 sm:px-6 sm:py-5"
    >
      <p className="font-display text-[1.18rem] sm:text-[1.3rem] leading-tight text-plum tracking-tight">
        {founderName}
      </p>
      <p className="mt-1.5 text-[12px] leading-snug text-editorial-body">
        {tHero("photoBadge")} · {tHero("founderCredential")}
      </p>
      <span className="rule-bronze my-3.5" aria-hidden />
      <p className="text-[12px] font-medium text-lav-700">
        {tHero("founderEyebrow")}, {tBrand("name")}
      </p>
      <Link
        href={`/${locale}/about`}
        className="group/link mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-lav-700 hover:text-plum transition-colors"
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

      {/* DESKTOP — the photograph sits in the right margin of the spread,
          anchored to the bottom-right corner and feathered on every edge, so it
          reads as part of the page rather than a picture placed on it. Kept
          deliberately small per the client's note: it accompanies the message,
          it does not compete with it. The box carries the photo's own 599:758
          ratio, so nothing of her is cropped — only the edges dissolve. */}
      <div
        className="hidden lg:block absolute bottom-0 right-0 h-[74%] w-auto aspect-[599/758] max-w-[40%] z-0"
        aria-hidden
      >
        {photo(true)}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="lg:max-w-[54%] xl:max-w-[52%] lg:pb-14">
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

          {/* Trust strip — four proofs on one hairline rule, separated by thin
              dividers instead of boxes. Discreet by request: the gold survives
              only in the marks themselves and in the rule above them, which is
              all the reference gives it. */}
          <motion.ul
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.72, ease: EASE_LUXURY }}
            className="relative mt-9 grid grid-cols-2 border-t border-[color:var(--editorial-line)] pt-1 xl:grid-cols-4"
          >
            <span className="rule-bronze absolute -top-px left-0" aria-hidden />
            {facts.map((fact, i) => {
              const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
              return (
                <li
                  key={fact}
                  className="group flex items-start gap-2.5 border-l border-[color:var(--editorial-line)] px-3.5 py-3.5 odd:border-l-0 odd:pl-0 xl:odd:border-l xl:odd:pl-3.5 xl:first:border-l-0 xl:first:pl-0"
                >
                  <Icon
                    className="mt-px h-[18px] w-[18px] shrink-0 text-gold-500 transition-colors duration-300 group-hover:text-gold-600"
                    aria-hidden
                  />
                  <span className="text-[11.5px] font-medium leading-[1.45] text-editorial-body transition-colors duration-300 group-hover:text-plum">
                    {fact}
                  </span>
                </li>
              );
            })}
          </motion.ul>
        </div>

        {/* MOBILE — the same photograph, kept small and centred so the message
            still leads the screen. */}
        <div className="lg:hidden relative mx-auto mt-10 w-[74%] max-w-[17rem] aspect-[599/758] overflow-hidden rounded-2xl border border-[color:var(--editorial-line)]">
          {photo(false)}
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[color:var(--editorial-cream-deep)] to-transparent"
            aria-hidden
          />
        </div>

        <div className="lg:hidden relative -mt-12 pb-14">{founderPlate}</div>
      </div>

      {/* The plate rides over the photograph on desktop and runs off the right
          edge of the page, the way it does in the reference. Scaled down with
          the photograph so the two stay in proportion. */}
      <div className="hidden lg:block absolute bottom-12 right-0 z-20 w-[20rem] xl:w-[21.5rem]">
        <div className="rounded-l-xl overflow-hidden">{founderPlate}</div>
      </div>
    </section>
  );
}
