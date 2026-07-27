"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type AtmosphericBackgroundProps = {
  variant?: "hero" | "section" | "dark";
  className?: string;
  children?: React.ReactNode;
};

export default function AtmosphericBackground({
  variant = "section",
  className,
  children,
}: AtmosphericBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const base =
    variant === "dark"
      ? "bg-dark-section"
      : variant === "hero"
        ? "bg-hero-canvas"
        : "bg-warm-mesh";

  return (
    <div ref={ref} className={cn("relative overflow-hidden", base, className)}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <motion.div
          style={{ y: y1 }}
          className={cn(
            "absolute rounded-full blur-3xl",
            variant === "dark"
              ? "-top-32 -right-20 w-[520px] h-[520px] bg-lav-700/25"
              : "-top-40 -left-32 w-[620px] h-[620px] bg-lav-200/45"
          )}
          animate={{ opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{ y: y2 }}
          className={cn(
            "absolute rounded-full blur-3xl",
            variant === "dark"
              ? "-bottom-24 -left-16 w-80 h-80 bg-gold-400/10"
              : "-bottom-32 right-0 w-[480px] h-[480px] bg-gold-300/25"
          )}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        {variant === "hero" && (
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-lav-100/40 blur-[100px]"
            animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
      <div className="absolute inset-0 dot-grid opacity-[0.018] pointer-events-none" aria-hidden />
      {children}
    </div>
  );
}
