"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Countdown from "@/components/workshops/Countdown";
import ResourceImage from "@/components/resources/ResourceImage";
import { apiFetch, parseJsonResponse } from "@/lib/api-client";
import { getWorkshopContent } from "@/lib/workshops/content";
import { resolveMediaUrl } from "@/lib/upload-url";
import { formatWorkshopDate, formatWorkshopTime } from "@/lib/workshops/status";
import { EASE_LUXURY } from "@/lib/motion";
import {
  dismissPopup,
  isPopupSuppressed,
  SHOW_DELAY_MS,
} from "@/components/workshops/popup-storage";
import type { WorkshopView } from "@/lib/workshops/types";

export default function WorkshopPopup() {
  const pathname = usePathname();
  const locale = useLocale();
  const content = getWorkshopContent(locale);

  const [workshop, setWorkshop] = useState<WorkshopView | null>(null);
  const [open, setOpen] = useState(false);
  const pathRef = useRef(pathname);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (isPopupSuppressed()) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      // Never surface the popup on a workshop page (landing or thank-you).
      if (pathRef.current?.includes("/workshop/")) return;
      try {
        const res = await apiFetch("/api/workshops?scope=featured");
        const data = await parseJsonResponse<{ workshop: WorkshopView | null }>(res);
        if (cancelled || !data.workshop) return;
        if (isPopupSuppressed(data.workshop.id)) return;
        setWorkshop(data.workshop);
        setOpen(true);
      } catch {
        // Silent — the popup is a non-critical enhancement.
      }
    }, SHOW_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // Intentionally run once on mount; pathname is read via ref at fire time.
  }, []);

  const close = () => {
    setOpen(false);
    dismissPopup();
  };

  if (!workshop) return null;

  const banner = resolveMediaUrl(workshop.bannerUrl);
  const href = `/${locale}/workshop/${workshop.slug}`;
  const startMs = new Date(workshop.startsAt).getTime();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label={content.popup.close}
            onClick={close}
            className="absolute inset-0 bg-plum/45 backdrop-blur-sm cursor-default"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={workshop.title}
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE_LUXURY }}
            className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-strong border border-lav-100 max-h-[92vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={close}
              aria-label={content.popup.close}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/85 backdrop-blur border border-lav-100 text-plum/60 hover:text-plum hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="relative aspect-[16/9] bg-gradient-to-br from-lav-600 via-lav-700 to-plum">
              {banner ? (
                <ResourceImage src={banner} alt={workshop.title} fill />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-white/90 text-2xl px-6 text-center">
                    {workshop.title}
                  </span>
                </div>
              )}
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-gold-400 text-plum text-[10px] font-bold uppercase tracking-wider px-3 py-1 shadow-soft">
                {content.popup.eyebrow}
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <h3 className="font-display text-xl sm:text-2xl text-plum leading-snug">
                {workshop.title}
              </h3>
              {workshop.subtitle && (
                <p className="text-body-premium text-sm mt-1.5 line-clamp-2">
                  {workshop.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lav-50 border border-lav-100 px-3 py-1.5 text-xs text-plum/70">
                  📅 {formatWorkshopDate(workshop, locale)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lav-50 border border-lav-100 px-3 py-1.5 text-xs text-plum/70">
                  🕒 {formatWorkshopTime(workshop, locale)}
                </span>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-bold text-plum/35 uppercase tracking-[0.2em] mb-2">
                  {content.hero.startsIn}
                </p>
                <Countdown
                  targetMs={startMs}
                  labels={content.countdown}
                  variant="compact"
                  numbersClassName="font-bold text-black"
                />
              </div>

              <Link href={href} onClick={close} className="block mt-6">
                <span className="flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 text-plum font-semibold py-3.5 text-[15px] shadow-gold-glow hover:from-gold-300 hover:to-gold-400 transition-colors cursor-pointer">
                  {content.popup.cta} →
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
