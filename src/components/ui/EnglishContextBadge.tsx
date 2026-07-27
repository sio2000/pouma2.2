"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

type EnglishContextBadgeProps = {
  variant?: "hero" | "inline";
  className?: string;
};

/** Supplementary English-language context — does not replace existing copy. */
export default function EnglishContextBadge({
  variant = "hero",
  className = "",
}: EnglishContextBadgeProps) {
  const t = useTranslations("english");

  if (variant === "inline") {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/80 border border-lav-200/60 shadow-soft ${className}`}
      >
        <FlagPair />
        <span className="text-[11px] font-medium text-plum/70 tracking-wide">
          {t("badgeShort")}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 1.25, ease: EASE_LUXURY }}
      className={`mx-auto max-w-xl ${className}`}
    >
      <div className="rounded-2xl glass border border-lav-200/50 px-5 py-4 shadow-soft text-center">
        <div className="flex items-center justify-center gap-3 mb-2.5">
          <FlagPair size="md" />
          <span className="text-eyebrow text-lav-700">{t("badge")}</span>
        </div>
        <p className="text-sm text-plum/55 leading-relaxed font-light">{t("note")}</p>
      </div>
    </motion.div>
  );
}

function FlagPair({ size = "sm" }: { size?: "sm" | "md" }) {
  const dim = size === "md" ? "w-7 h-5" : "w-6 h-4";
  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      <span
        className={`${dim} rounded-[3px] overflow-hidden inline-block shadow-sm ring-1 ring-black/5`}
        title="English (UK)"
      >
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect width="60" height="40" fill="#012169" />
          <path d="M0 0l60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
          <path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
          <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="12" />
          <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      </span>
      <span
        className={`${dim} rounded-[3px] overflow-hidden inline-block shadow-sm ring-1 ring-black/5`}
        title="English (US)"
      >
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect width="60" height="40" fill="#B22234" />
          <path
            fill="#fff"
            d="M0 3h60M0 9h60M0 15h60M0 21h60M0 27h60M0 33h60"
          />
          <rect width="24" height="21" fill="#3C3B6E" />
        </svg>
      </span>
    </span>
  );
}
