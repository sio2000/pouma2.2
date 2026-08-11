"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import HeroWorkshopButton from "@/components/sections/hero/HeroWorkshopButton";
import { UsersIcon, TargetIcon, GrowthIcon } from "@/components/home/HomeIcons";
import { EASE_LUXURY } from "@/lib/motion";

const BADGE_ICONS = [UsersIcon, TargetIcon, GrowthIcon];

/**
 * The dark opening of the homepage, built to the layout the client approved:
 * a deep plum field, the promise set large in serif on the left, and the
 * portrait filling the right behind a tall arched edge. Nothing is boxed —
 * the arch is the only shape on the page.
 */
export default function HomeHero() {
  const t = useTranslations("home.hero");
  const tBrand = useTranslations("brand");
  const locale = useLocale();

  const founderName = locale === "el" ? "Δήμητρα Γιαννουπλάκη" : "Dimitra Giannouplaki";
  const badges = t.raw("badges") as string[];

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-home-ink pt-32 sm:pt-36 lg:pt-32">
      {/* The portrait: right half on desktop, held inside a tall arch whose
          left edge is a single brass hairline. */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 top-24 hidden w-[41%] xl:w-[40%] lg:block"
        aria-hidden
      >
        <div className="relative h-full w-full overflow-hidden rounded-bl-[13rem] rounded-tl-[13rem]">
          <Image
            src="/newherosectionimage.png"
            alt={`${founderName} — ${tBrand("name")}`}
            fill
            priority
            sizes="41vw"
            className="object-cover object-[52%_16%]"
          />
          {/* Just enough to blend the left edge into the violet field — the
              photograph itself is left alone so her colours stay true. */}
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--home-ink)] via-[color:var(--home-ink)]/12 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--home-ink-deep)]/55 via-transparent to-[color:var(--home-ink)]/18" />
        </div>
        <div className="absolute inset-y-0 left-0 w-px rounded-full bg-gradient-to-b from-transparent via-[color:var(--home-brass)]/50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="lg:max-w-[54%] lg:py-24 xl:py-28">
          <div className="[&>div]:justify-start [&>div]:mb-7">
            <HeroWorkshopButton />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
            className="text-brass-soft text-[11px] font-medium uppercase tracking-[0.22em] sm:text-xs"
          >
            {t("eyebrow")}
          </motion.p>

          <div className="mt-7 space-y-1">
            {[t("line1"), t("line2"), t("line3")].map((line, i) => (
              <div key={line} className="overflow-hidden pb-1">
                <motion.h1
                  initial={{ y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.1 + i * 0.1, ease: EASE_LUXURY }}
                  className="home-display text-white text-[clamp(2.1rem,4.6vw,3.6rem)]"
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
            className="mt-7 max-w-xl text-[15px] leading-[1.85] text-white/62 md:text-base"
          >
            {t("lead")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.58, ease: EASE_LUXURY }}
            className="mt-10"
          >
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-3 rounded-md bg-gradient-to-b from-[color:var(--home-brass-soft)] to-[color:var(--home-brass)] px-8 py-4 text-[15px] font-semibold text-[color:var(--home-ink-deep)] shadow-[0_12px_32px_rgba(198,161,91,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(198,161,91,0.4)]"
            >
              {t("cta")}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </Link>
          </motion.div>

          {/* The three proofs, on one hairline row under the button. */}
          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.72, ease: EASE_LUXURY }}
            className="mt-12 flex flex-wrap items-center gap-x-9 gap-y-4 border-t border-white/10 pt-7"
          >
            {badges.map((badge, i) => {
              const Icon = BADGE_ICONS[i % BADGE_ICONS.length];
              return (
                <li key={badge} className="flex items-center gap-2.5">
                  <Icon className="text-brass-soft h-[19px] w-[19px] shrink-0" />
                  <span className="text-[12.5px] text-white/72">{badge}</span>
                </li>
              );
            })}
          </motion.ul>
        </div>

        {/* Mobile: the same portrait, arched on its top edge, under the copy. */}
        <div className="relative -mx-5 mt-12 h-[58vh] min-h-[360px] overflow-hidden rounded-t-[7rem] sm:-mx-6 lg:hidden">
          <Image
            src="/newherosectionimage.png"
            alt={`${founderName} — ${tBrand("name")}`}
            fill
            sizes="100vw"
            className="object-cover object-[52%_14%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--home-ink-deep)] via-transparent to-[color:var(--home-ink)]/25" />
        </div>
      </div>
    </section>
  );
}
