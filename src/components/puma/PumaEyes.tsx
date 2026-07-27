"use client";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * PumaEyes — a pair of amber eyes glowing out of the dark, with an occasional
 * slow blink. Dropped into dark sections to suggest the puma watching from the
 * shadows: the power is present even when unseen. Decorative only.
 */
export default function PumaEyes({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  const glow = "0 0 18px 5px color-mix(in srgb, var(--color-gold-300) 70%, transparent)";

  const blink = reduce
    ? { opacity: 0.85 }
    : {
        // long open, quick double-blink near the end of the loop
        opacity: [0.55, 1, 1, 0.05, 1, 0.05, 1, 0.55],
        scaleY: [1, 1, 1, 0.1, 1, 0.1, 1, 1],
      };

  const transition = {
    duration: 6.5,
    times: [0, 0.1, 0.7, 0.74, 0.8, 0.84, 0.9, 1],
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  return (
    <div
      className={cn("flex items-center gap-5", className)}
      aria-hidden
    >
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="block h-2.5 w-4 rounded-full bg-gold-300"
          style={{ boxShadow: glow, transformOrigin: "center" }}
          animate={blink}
          transition={{ ...transition, delay: i * 0.04 }}
        />
      ))}
    </div>
  );
}
