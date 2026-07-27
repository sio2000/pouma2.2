"use client";

import { Children, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useInView, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";

/** Map each quote to a homepage section band (6 quotes across 9 sections). */
function quoteRange(index: number) {
  const sections = 10;
  const start = Math.max(0, index / sections - 0.01);
  const center = (index + 0.65) / sections;
  const end = Math.min(1, (index + 1.35) / sections + 0.01);
  const fade = Math.min((end - start) * 0.28, 0.055);

  return {
    input: [start, start + fade, center, end - fade, end] as [
      number,
      number,
      number,
      number,
      number,
    ],
  };
}

function FloatingQuote({
  text,
  index,
  scrollYProgress,
}: {
  text: string;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const isLeft = index % 2 === 0;
  const { input } = quoteRange(index);

  const opacity = useTransform(scrollYProgress, input, [0, 0.78, 1, 0.78, 0]);
  const x = useTransform(
    scrollYProgress,
    input,
    isLeft ? [-95, -35, 0, -35, -95] : [95, 35, 0, 35, 95]
  );
  const y = useTransform(scrollYProgress, input, [45, 20, 0, -20, -45]);
  const scale = useTransform(scrollYProgress, input, [0.98, 1.02, 1.08, 1.02, 0.98]);
  const rotate = useTransform(
    scrollYProgress,
    input,
    isLeft ? [-2.2, -0.8, 0, -0.8, -2.2] : [2.2, 0.8, 0, 0.8, 2.2]
  );
  const blur = useTransform(scrollYProgress, input, [3, 0, 0, 0, 3]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  const lineW = useTransform(scrollYProgress, input, [0, 0.72, 1, 0.72, 0]);

  const topOffsets = ["38%", "44%", "36%", "46%", "40%", "42%"];

  return (
    <motion.div
      style={{
        opacity,
        x,
        y,
        scale,
        rotate,
        filter,
        top: topOffsets[index % topOffsets.length],
      }}
      className={`fixed z-30 w-[min(26rem,36vw)] pointer-events-none hidden xl:block ${
        isLeft ? "left-8 2xl:left-14" : "right-8 2xl:right-14"
      }`}
      aria-hidden
    >
      <div
        className={`relative rounded-[2.25rem] border border-lav-300/80 bg-white/95 backdrop-blur-xl px-6 py-5 shadow-[0_36px_110px_rgba(58,23,128,0.15)] ring-1 ring-lav-100/90 ${
          isLeft ? "text-left" : "text-right"
        }`}
      >
        <div className="absolute -top-3 left-5 text-[2.25rem] text-gold-300/85">“</div>
        <div className="absolute inset-0 rounded-[2.25rem] bg-gradient-to-br from-lav-50/70 via-transparent to-gold-100/25 pointer-events-none" />
        <p className="relative font-display italic text-[clamp(1.15rem,1.55vw,1.65rem)] text-plum-950/95 leading-tight tracking-wide">
          {text}
        </p>
        <motion.div
          style={{ scaleX: lineW }}
          className={`mt-5 h-px w-20 bg-gradient-to-r from-plum-700 to-transparent ${
            isLeft ? "origin-left" : "ml-auto origin-right"
          }`}
        />
      </div>
    </motion.div>
  );
}

function MobileQuote({
  text,
  align,
}: {
  text: string;
  align: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-15% 0px", amount: 0.6 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`xl:hidden px-6 py-3 pointer-events-none ${
        align === "left" ? "text-left" : "text-right"
      }`}
      aria-hidden
    >
      <p className="font-display italic text-[1.15rem] text-plum/75 leading-snug max-w-[16rem] inline-block border-l-2 border-lav-300/50 pl-4">
        {text}
      </p>
    </motion.div>
  );
}

function QuoteLayer({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const t = useTranslations("scrollQuotes");
  const quotes = [t("q1"), t("q2"), t("q3"), t("q4"), t("q5"), t("q6")];

  return (
    <>
      {quotes.map((text, i) => (
        <FloatingQuote
          key={i}
          text={text}
          index={i}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </>
  );
}

type HomeSectionsWithQuotesProps = {
  children: ReactNode;
};

/**
 * Wraps homepage sections and scatters emotional quotes left/right while scrolling.
 */
export function HomeSectionsWithQuotes({ children }: HomeSectionsWithQuotesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("scrollQuotes");
  const quotes = [t("q1"), t("q2"), t("q3"), t("q4"), t("q5"), t("q6")];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.25"],
  });

  const childArray = Children.toArray(children);
  const mobileInsertAfter = [0, 2, 4, 5, 7, 8];

  return (
    <div ref={containerRef} className="relative">
      <QuoteLayer scrollYProgress={scrollYProgress} />
      {childArray.map((child, i) => (
        <div key={i}>
          {child}
          {mobileInsertAfter.includes(i) && (
            <MobileQuote
              text={quotes[mobileInsertAfter.indexOf(i)]}
              align={mobileInsertAfter.indexOf(i) % 2 === 0 ? "left" : "right"}
            />
          )}
        </div>
      ))}
    </div>
  );
}
