"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  LotusIcon,
  EyeIcon,
  MountainIcon,
  ShieldIcon,
  PrecisionIcon,
} from "@/components/home/HomeIcons";
import { EASE_LUXURY } from "@/lib/motion";

type Trait = { title: string; desc: string };

const TRAIT_ICONS = [LotusIcon, EyeIcon, MountainIcon, ShieldIcon, PrecisionIcon];

/** The plum the photograph was actually shot against, sampled from the file
 *  itself, so the plate and the picture's own background are one colour and
 *  the edges of the crop disappear. */
const PHOTO_PLUM = "#1C1024";

/** The faint botanical branch from the client's reference, drawn rather than
 *  baked into the picture so it stays crisp at any width. */
function LeafBranch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 300"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M132 6C108 62 86 122 70 186c-8 32-13 62-15 92" />
      <path d="M118 40c-22-5-42 3-53 22-5 9-7 19-6 29 21 5 41-3 52-21 6-9 8-19 7-30Z" />
      <path d="M104 92c-22-5-42 3-53 22-5 9-7 19-6 29 21 5 41-3 52-21 6-9 8-19 7-30Z" />
      <path d="M90 146c-22-5-42 3-53 22-5 9-7 19-6 29 21 5 41-3 52-21 6-9 8-19 7-30Z" />
      <path d="M78 202c-21-5-40 3-51 21-5 9-7 18-6 28 20 5 39-3 50-20 6-9 8-19 7-29Z" />
      <path d="M126 68c20 6 35 19 41 38 3 9 4 18 2 27-19-1-35-11-42-28-3-11-4-24-1-37Z" />
      <path d="M112 124c20 6 35 19 41 38 3 9 4 18 2 27-19-1-35-11-42-28-3-11-4-24-1-37Z" />
      <path d="M98 182c19 6 33 19 39 37 3 9 4 18 2 26-18-1-33-10-40-27-3-11-4-23-1-36Z" />
    </svg>
  );
}

/**
 * "Γιατί Pouma;" — the animal is the point of this section, so it gets a full
 * width plate rather than a narrow column: the photograph carried large on the
 * right, the heading and the opening line held in the quiet plum on the left
 * with the branch behind them, exactly the way the client's reference frames
 * it. The five traits and the closing line sit underneath, on the paper.
 */
export default function WhyPumaSection() {
  const t = useTranslations("home.whyPuma");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const traits = t.raw("traits") as Trait[];

  return (
    <section className="relative overflow-hidden bg-home-paper">
      <div ref={ref} className="home-container py-14 md:py-18">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.05, ease: EASE_LUXURY }}
          className="relative overflow-hidden rounded-2xl ring-1 ring-[color:var(--home-brass)]/25 shadow-[0_26px_70px_rgba(101,52,182,0.26)]"
          style={{ backgroundColor: PHOTO_PLUM }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[44%_56%]">
            {/* The photograph. On its own row on small screens, on the right of
                the plate from lg up. */}
            <div className="relative order-1 h-[15rem] sm:h-[19rem] lg:order-2 lg:col-start-2 lg:row-start-1 lg:h-[28rem]">
              <Image
                src="/puma-philosophy.png"
                alt=""
                fill
                priority={false}
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover object-[64%_42%] lg:object-[58%_44%]"
              />
              {/* Long fades back into the plate so the crop reads as one plane
                  with the type beside it. */}
              <div
                className="absolute inset-0 hidden lg:block"
                style={{
                  backgroundImage: `linear-gradient(to right, ${PHOTO_PLUM} 0%, transparent 34%, transparent 100%)`,
                }}
                aria-hidden
              />
              <div
                className="absolute inset-x-0 bottom-0 h-24"
                style={{
                  backgroundImage: `linear-gradient(to top, ${PHOTO_PLUM} 0%, transparent 100%)`,
                }}
                aria-hidden
              />
            </div>

            {/* The heading and the opening line, held in the plum. */}
            <div className="relative order-2 z-10 px-7 pb-10 pt-8 sm:px-10 lg:order-1 lg:col-start-1 lg:row-start-1 lg:flex lg:flex-col lg:justify-center lg:py-14 lg:pl-12 lg:pr-8">
              <LeafBranch
                className="pointer-events-none absolute -left-6 bottom-0 h-[80%] w-auto text-white opacity-[0.11] lg:-left-4 lg:top-1/2 lg:h-[92%] lg:-translate-y-1/2"
              />

              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
                className="home-display relative text-center text-white text-[clamp(1.85rem,3.4vw,2.6rem)] lg:text-left"
              >
                {t("title")}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.22, ease: EASE_LUXURY }}
                className="relative mt-5 max-w-xl text-center text-[16.5px] leading-[1.85] text-white/78 lg:text-left"
              >
                {t("lead")}
              </motion.p>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {traits.map((trait, i) => {
            const Icon = TRAIT_ICONS[i % TRAIT_ICONS.length];
            return (
              <motion.div
                key={trait.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.09, ease: EASE_LUXURY }}
                className="group flex flex-col items-center text-center"
              >
                <Icon className="h-8 w-8 text-brass" />
                <h3 className="mt-4 text-[15px] font-semibold text-[color:var(--home-ink)]">
                  {trait.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-[color:var(--home-ink)]/68">
                  {trait.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.8, ease: EASE_LUXURY }}
          className="mt-10 text-center text-[16.5px] italic text-[color:var(--home-ink)]/80"
        >
          {t("closing")}
        </motion.p>
      </div>
    </section>
  );
}
