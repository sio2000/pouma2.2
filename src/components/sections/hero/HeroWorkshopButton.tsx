"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { apiFetch, parseJsonResponse } from "@/lib/api-client";
import { getWorkshopContent } from "@/lib/workshops/content";
import { EASE_LUXURY } from "@/lib/motion";
import type { WorkshopView } from "@/lib/workshops/types";

/**
 * The purple "featured workshop" pill, centred symmetrically just above the
 * programmes grid. Fetches the currently featured workshop client-side and
 * links straight to it; renders nothing when there is no active workshop.
 */
export default function HeroWorkshopButton() {
  const locale = useLocale();
  const content = getWorkshopContent(locale);
  const [workshop, setWorkshop] = useState<WorkshopView | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/api/workshops?scope=featured");
        const data = await parseJsonResponse<{ workshop: WorkshopView | null }>(res);
        if (!cancelled) setWorkshop(data.workshop);
      } catch {
        /* non-critical enhancement — stay silent */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!workshop) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_LUXURY }}
      className="mb-8 flex justify-center lg:mb-10"
    >
      <div className="relative">
        {/* Breathing halo — the "look at me" cue. */}
        <motion.span
          aria-hidden
          animate={{ opacity: [0.3, 0.65, 0.3] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -inset-1.5 rounded-full bg-gradient-to-r from-lav-500 via-plum to-gold-400 blur-xl"
        />
        <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
          <Link
            href={`/${locale}/workshop/${workshop.slug}`}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-gradient-to-r from-plum via-lav-700 to-plum-mid px-7 py-3.5 shadow-strong"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full"
            />
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-plum text-sm font-bold shadow-gold-glow">
              ✦
            </span>
            <span className="relative flex flex-col text-left leading-tight">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-200">
                {content.popup.eyebrow}
              </span>
              <span className="text-sm sm:text-base font-bold text-white">
                {content.popup.cta}
              </span>
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
