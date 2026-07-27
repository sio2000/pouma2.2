"use client";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * PumaClawDivider — three gold claw-slashes that tear across the page as they
 * scroll into view, drawing stroke-by-stroke. Used as a section transition to
 * signal the "power unleashed" beat. Purely decorative.
 */
export default function PumaClawDivider({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();

  const stroke =
    tone === "dark" ? "var(--color-gold-300)" : "var(--color-gold-400)";

  return (
    <div
      ref={ref}
      className={cn("relative mx-auto flex w-full max-w-2xl justify-center py-2", className)}
      aria-hidden
    >
      <svg viewBox="0 0 520 120" className="h-16 w-full max-w-lg md:h-20">
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M ${120 + i * 130} 14
                C ${150 + i * 130} 44, ${170 + i * 130} 74, ${210 + i * 130} 104`}
            fill="none"
            stroke={stroke}
            strokeWidth={7 - i}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px color-mix(in srgb, ${stroke} 55%, transparent))` }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              inView
                ? { pathLength: 1, opacity: [0, 1, 0.85] }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              duration: reduce ? 0 : 0.5,
              delay: reduce ? 0 : i * 0.12,
              ease: [0.65, 0, 0.35, 1],
            }}
          />
        ))}
      </svg>
    </div>
  );
}
