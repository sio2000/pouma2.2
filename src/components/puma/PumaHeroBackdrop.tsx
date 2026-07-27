"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * PumaHeroBackdrop — the ambient layer that lives behind the hero content. It
 * is deliberately quiet: a slow breathing aura of energy and drifting embers
 * rising like latent potential. Fully decorative — hidden from assistive tech
 * and disabled for users who prefer reduced motion.
 */
export default function PumaHeroBackdrop() {
  const reduce = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Breathing energy aura — the "power core". */}
      <motion.div
        className="absolute right-[10%] top-[48%] h-[520px] w-[520px] -translate-y-1/2 rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-gold-400) 34%, transparent) 0%, color-mix(in srgb, var(--color-lav-500) 18%, transparent) 45%, transparent 72%)",
        }}
        animate={
          reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rising embers — latent energy drifting upward. */}
      {!reduce && <Embers />}
    </div>
  );
}

function Embers() {
  // Deterministic-ish positions so hydration is stable.
  const [seeds] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      left: (i * 67) % 100,
      size: 2 + ((i * 37) % 4),
      delay: (i % 7) * 0.9,
      duration: 9 + ((i * 13) % 8),
      drift: ((i % 5) - 2) * 18,
    })),
  );

  return (
    <div className="absolute inset-0">
      {seeds.map((s, i) => (
        <motion.span
          key={i}
          className="absolute bottom-[-10px] rounded-full bg-gold-300/70"
          style={{ left: `${s.left}%`, width: s.size, height: s.size }}
          animate={{
            y: [0, -560],
            x: [0, s.drift],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
