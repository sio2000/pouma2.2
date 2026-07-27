"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useAutoRotate } from "@/hooks/useAutoRotate";
import { EASE_LUXURY } from "@/lib/motion";

type TestimonialItem = {
  name: string;
  role: string;
  quote: string;
  transformation: string;
  context?: string;
  avatar?: string;
};

function NavArrow({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full glass border border-lav-200/60 shadow-medium flex items-center justify-center text-plum/70 hover:text-lav-600 hover:border-lav-400 hover:shadow-glow transition-all duration-300 cursor-pointer max-lg:hidden"
      style={direction === "prev" ? { left: "-0.25rem" } : { right: "-0.25rem" }}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {direction === "prev" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        )}
      </svg>
    </button>
  );
}

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const rawItems = t.raw("items") as TestimonialItem[];
  const items = rawItems.map((item) => ({
    name: item.name,
    role: item.role,
    quote: item.quote,
    transformation: item.transformation,
    context: item.context ?? "",
    avatar: item.avatar ?? "",
  }));

  const { active, setActive, pause, resume } = useAutoRotate({
    length: items.length,
    intervalMs: 2000,
    enabled: inView,
  });

  const goNext = () => setActive((active + 1) % items.length);
  const goPrev = () => setActive((active - 1 + items.length) % items.length);

  return (
    <section
      className="relative py-16 md:py-20 px-6 md:px-10 bg-white overflow-hidden"
      onMouseEnter={pause}
      onMouseLeave={resume}
      aria-roledescription="carousel"
      aria-label={t("label")}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[420px] rounded-b-full bg-lav-50/80 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={ref} className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="w-6 h-px bg-lav-500" />
            <span className="text-eyebrow text-lav-600">{t("label")}</span>
            <div className="w-6 h-px bg-lav-500" />
          </motion.div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: 60, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
              className="font-display font-light text-4xl md:text-5xl text-plum leading-tight tracking-tight"
            >
              {t("headline")}
              <br />
              {t("headline2")}
            </motion.h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative px-2 sm:px-4 md:px-14"
        >
          <NavArrow
            direction="prev"
            onClick={goPrev}
            label={locale === "el" ? "Προηγούμενη εμπειρία" : "Previous story"}
          />
          <NavArrow
            direction="next"
            onClick={goNext}
            label={locale === "el" ? "Επόμενη εμπειρία" : "Next story"}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.45, ease: EASE_LUXURY }}
              className="grid grid-cols-1 lg:grid-cols-5 rounded-[1.75rem] overflow-hidden shadow-strong ring-1 ring-lav-100/80"
            >
              <div className="lg:col-span-3 bg-ivory p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-between max-lg:min-h-0 min-h-[320px]">
                <div>
                  {items[active].context && (
                    <p className="text-[11px] font-medium text-plum/35 uppercase tracking-widest mb-6">
                      {items[active].context}
                    </p>
                  )}
                  <blockquote className="font-sans text-lg md:text-xl text-plum/85 leading-relaxed mb-8 relative pl-1">
                    <span className="font-display text-5xl text-lav-300/70 leading-none absolute -top-2 -left-1 select-none">
                      &ldquo;
                    </span>
                    <span className="relative block pt-4">{items[active].quote}</span>
                  </blockquote>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-lav-100">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-lav-200/80 shadow-soft flex-shrink-0 bg-lav-100">
                    {items[active].avatar ? (
                      <Image
                        src={items[active].avatar}
                        alt={items[active].name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-lav-400 to-lav-700 flex items-center justify-center text-white font-semibold text-sm">
                        {items[active].name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-plum text-sm">{items[active].name}</div>
                    <div className="text-plum/45 text-xs mt-0.5 font-light">{items[active].role}</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-dark-section relative overflow-hidden flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 max-lg:min-h-0 min-h-[240px]">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-lav-700/22 blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-gold-400/8 blur-2xl" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="text-eyebrow text-lav-300 mb-5">
                    {locale === "el" ? "Μεταμόρφωση" : "Transformation"}
                  </div>
                  <div className="w-8 h-px bg-gold-400/40 mx-auto mb-5" />
                  <p className="font-display italic text-xl md:text-2xl text-gold-300 leading-snug">
                    {items[active].transformation}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center items-center gap-2 sm:gap-3 mt-8 sm:mt-10">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className="flex items-center justify-center min-h-11 min-w-11 p-3 cursor-pointer rounded-full"
                aria-label={`${locale === "el" ? "Εμπειρία" : "Story"} ${i + 1}`}
                aria-current={active === i ? "true" : undefined}
              >
                <span
                  className={`block transition-all duration-400 rounded-full ${
                    active === i ? "w-10 h-2 bg-lav-600" : "w-2 h-2 bg-lav-200 hover:bg-lav-400"
                  }`}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
