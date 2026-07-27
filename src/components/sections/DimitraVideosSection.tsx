"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { DIMITRA_VIDEOS, type DimitraVideo } from "@/lib/dimitra-videos";
import { EASE_LUXURY } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CARD_TILT = ["-rotate-[2.4deg]", "rotate-[1.8deg]", "-rotate-[1.2deg]"] as const;

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function FullscreenIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
    </svg>
  );
}

function VideoModal({
  video,
  title,
  playLabel,
  fullscreenLabel,
  closeLabel,
  onClose,
}: {
  video: DimitraVideo;
  title: string;
  playLabel: string;
  fullscreenLabel: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (el) {
      el.load();
      void el.play().catch(() => undefined);
    }
  }, [video.id, video.src]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const enterFullscreen = useCallback(async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if ("webkitEnterFullscreen" in el) (el as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-plum-mid/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.45, ease: EASE_LUXURY }}
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-plum-mid shadow-strong ring-1 ring-lav-300/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-white/10 bg-plum-mid/80">
          <p className="text-sm md:text-base text-lav-100 font-medium tracking-wide">{title}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void enterFullscreen()}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 sm:py-1.5 text-xs font-semibold text-lav-100 bg-lav-700/40 hover:bg-lav-600/50 transition-colors cursor-pointer min-h-11 sm:min-h-0"
              aria-label={fullscreenLabel}
            >
              <FullscreenIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{fullscreenLabel}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full min-w-11 min-h-11 w-11 h-11 flex items-center justify-center text-lav-100/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={closeLabel}
            >
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
        </div>

        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={video.src}
            poster={video.poster}
            controls
            playsInline
            className="w-full h-full object-contain"
          >
            {playLabel}
          </video>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * The three tappable video cards + their modal. Reused in two places:
 *  - `compact` (default off): the standalone "Γνώρισε τη Δήμητρα" section.
 *  - `compact` on: a tight, symmetric strip tucked under the Method cards.
 */
export function DimitraVideoGrid({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("dimitraVideos");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [active, setActive] = useState<DimitraVideo | null>(null);

  const titles = {
    dimitra1: t("video1Title"),
    dimitra2: t("video2Title"),
    dimitra3: t("video3Title"),
  };

  return (
    <div
      ref={ref}
      className={cn(
        "grid items-stretch",
        compact
          ? "grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto"
          : "grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
      )}
    >
      {DIMITRA_VIDEOS.map((video, i) => (
        <motion.button
          key={video.id}
          type="button"
          initial={{ opacity: 0, y: compact ? 24 : 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.12 + i * 0.1, ease: EASE_LUXURY }}
          onClick={() => setActive(video)}
          className={cn(
            "group text-left w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-lav-500 focus-visible:ring-offset-2 focus-visible:ring-offset-lav-50 rounded-[1.35rem]",
            compact
              ? "rotate-0 hover:-translate-y-1"
              : cn(CARD_TILT[i % CARD_TILT.length], "max-lg:rotate-0 lg:hover:rotate-0 lg:hover:-translate-y-1"),
            "transition-transform duration-500"
          )}
          aria-label={`${t("play")}: ${titles[video.id]}`}
        >
          <div
            className={cn(
              "relative overflow-hidden bg-white shadow-soft ring-1 ring-lav-200/60 group-hover:shadow-glow group-hover:ring-lav-400/50 transition-all duration-500",
              compact ? "rounded-xl" : "rounded-[1.35rem]"
            )}
          >
            <div className={cn("relative", compact ? "aspect-[3/4]" : "aspect-[4/5] md:aspect-[3/4]")}>
              <Image
                src={video.poster}
                alt=""
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes={compact ? "(max-width: 768px) 33vw, 180px" : "(max-width: 768px) 100vw, 33vw"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-mid/65 via-lav-700/15 to-lav-400/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full bg-white/90 text-lav-600 shadow-medium ring-1 ring-lav-300/70 border border-white/60 group-hover:scale-110 group-hover:ring-gold-300/70 transition-all duration-500",
                    compact ? "w-11 h-11 md:w-12 md:h-12" : "w-12 h-12 md:w-14 md:h-14"
                  )}
                >
                  <PlayIcon className={compact ? "w-4 h-4 ml-0.5" : "w-5 h-5 ml-0.5"} />
                </span>
              </div>
              <div className={cn("absolute bottom-0 left-0 right-0", compact ? "p-2.5 md:p-3" : "p-5 md:p-6")}>
                <p
                  className={cn(
                    "font-display text-white leading-snug",
                    compact ? "text-base md:text-lg" : "text-xl md:text-2xl"
                  )}
                >
                  {titles[video.id]}
                </p>
              </div>
            </div>
          </div>
        </motion.button>
      ))}

      <AnimatePresence>
        {active && (
          <VideoModal
            video={active}
            title={titles[active.id]}
            playLabel={t("play")}
            fullscreenLabel={t("fullscreen")}
            closeLabel={t("close")}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DimitraVideosSection() {
  const t = useTranslations("dimitraVideos");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-b from-lav-50 via-lav-100/80 to-ivory-mid"
      aria-labelledby="dimitra-videos-heading"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-lav-200/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-lav-300/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-12deg, transparent, transparent 18px, var(--color-lav-500) 18px, var(--color-lav-500) 19px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_LUXURY }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <div className="rule-ornament mb-6 w-fit mx-auto">{t("label")}</div>
          <h2
            id="dimitra-videos-heading"
            className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-plum leading-[1.08] tracking-tight"
          >
            {t("headline")}
          </h2>
          <p className="mt-5 text-plum/55 text-base md:text-lg leading-relaxed">{t("body")}</p>
        </motion.div>

        <DimitraVideoGrid />
      </div>
    </section>
  );
}
