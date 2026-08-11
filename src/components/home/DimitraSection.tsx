"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import {
  ClockIcon,
  BookIcon,
  UsersIcon,
  BadgeIcon,
} from "@/components/home/HomeIcons";
import { EASE_LUXURY } from "@/lib/motion";

const FACT_ICONS = [ClockIcon, BookIcon, UsersIcon, BadgeIcon];

/**
 * "Η Δήμητρα" — her photograph bleeding off the left edge of the page, her own
 * words on the right, and the four things worth knowing set on a hairline row
 * beneath them. She speaks in the first person here, as in the reference.
 */
export default function DimitraSection() {
  const t = useTranslations("home.dimitra");
  const tHero = useTranslations("hero");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  const founderName = locale === "el" ? "Δήμητρα Γιαννουπλάκη" : "Dimitra Giannouplaki";
  const facts = t.raw("facts") as string[];

  return (
    <section className="relative overflow-hidden bg-home-paper">
      <div className="grid grid-cols-1 lg:grid-cols-[38%_62%]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.1, ease: EASE_LUXURY }}
          className="relative h-[22rem] lg:h-auto lg:min-h-[30rem]"
        >
          <Image
            src="/dimitra.png"
            alt={founderName}
            fill
            sizes="(max-width: 1024px) 100vw, 38vw"
            className="object-cover object-[50%_26%] saturate-[0.72] brightness-[0.99]"
          />
          {/* Warm brass wash so the photograph belongs to the paper band. */}
          <div className="absolute inset-0 bg-[color:var(--home-brass)]/18 mix-blend-multiply" aria-hidden />
          <div className="absolute inset-0 bg-[#241733]/8 mix-blend-multiply" aria-hidden />
          {/* Right edge dissolves into the paper so there is no hard frame. */}
          <div
            className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-[color:var(--home-paper)] to-transparent lg:block"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[color:var(--home-paper)] to-transparent lg:hidden"
            aria-hidden
          />
        </motion.div>

        <div ref={ref} className="px-5 py-16 sm:px-6 md:py-20 lg:pl-6 lg:pr-10">
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE_LUXURY }}
            className="home-display text-[color:var(--home-ink)] text-[clamp(1.9rem,4.2vw,2.9rem)]"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_LUXURY }}
            className="mt-7 max-w-2xl text-[14.5px] leading-[1.9] text-[color:var(--home-ink)]/68"
          >
            {t("p1")}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.26, ease: EASE_LUXURY }}
            className="mt-5 max-w-2xl text-[14.5px] leading-[1.9] text-[color:var(--home-ink)]/68"
          >
            {t("p2")}
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.38, ease: EASE_LUXURY }}
            className="mt-11 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[color:var(--home-line)] pt-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {facts.map((fact, i) => {
              const Icon = FACT_ICONS[i % FACT_ICONS.length];
              return (
                <li key={fact} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-[19px] w-[19px] shrink-0 text-brass" />
                  <span className="text-[12px] leading-[1.5] text-[color:var(--home-ink)]/70">
                    {fact}
                  </span>
                </li>
              );
            })}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE_LUXURY }}
          >
            <Link
              href={`/${locale}/about`}
              className="group mt-8 inline-flex items-center gap-2 text-[13px] font-semibold text-brass transition-colors hover:text-[color:var(--home-ink)]"
            >
              {tHero("aboutMore")}
              <svg
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
