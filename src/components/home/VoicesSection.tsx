"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

type Testimonial = { name: string; role: string; quote: string };

/**
 * "Τι λένε οι συμμετέχοντες" — three quotes, each opened by an oversized plum
 * quotation mark, exactly as in the client's reference. The words are the
 * site's own testimonials; only the presentation is new.
 */
export default function VoicesSection() {
  const t = useTranslations("home.voices");
  const tTesti = useTranslations("testimonials");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const items = (tTesti.raw("items") as Testimonial[]).slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-home-paper py-12 md:py-16">
      <div ref={ref} className="home-container">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
          className="home-display text-center text-[color:var(--home-ink)] text-[clamp(1.7rem,3.2vw,2.35rem)]"
        >
          {t("title")}
        </motion.h2>

        <div className="mt-11 grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.figure
              key={item.name}
              initial={{ opacity: 0, y: 26 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.18 + i * 0.11, ease: EASE_LUXURY }}
              className="home-card group flex flex-col p-7"
            >
              <div className="flex gap-4">
                <span
                  className="home-display shrink-0 text-[2.9rem] leading-[0.75] text-[color:var(--home-ink)]/45"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <blockquote className="text-[14.5px] leading-[1.75] text-[color:var(--home-ink)]/72">
                  {item.quote}
                </blockquote>
              </div>

              <figcaption className="mt-6 pl-[3.4rem]">
                <span className="home-display block text-[1.08rem] text-[color:var(--home-ink)]">
                  {item.name}
                </span>
                <span className="mt-0.5 block text-[13px] text-brass">{item.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
