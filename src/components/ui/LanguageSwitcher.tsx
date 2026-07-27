"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "navbar" | "mobile";

const LABELS = {
  el: { group: "Γλώσσα", el: "Ελληνικά", en: "English" },
  en: { group: "Language", el: "Ελληνικά", en: "English" },
} as const;

const LOCALES = [
  { code: "el" as const, flag: "🇬🇷", short: "EL" },
  { code: "en" as const, flag: "🇬🇧", short: "EN" },
];

export default function LanguageSwitcher({ variant = "navbar" }: { variant?: Variant }) {
  const locale = useLocale() as "el" | "en";
  const pathname = usePathname();
  const router = useRouter();
  const labels = LABELS[locale];

  const setLocale = (next: "el" | "en") => {
    if (next === locale) return;

    const nextPath = pathname.replace(/^(?:\/(?:el|en))/, `/${next}`);
    router.replace(nextPath);
  };

  const isMobile = variant === "mobile";

  if (isMobile) {
    return (
      <div className="w-full space-y-3" role="group" aria-label={labels.group}>
        <div className="flex items-center justify-center gap-2 text-white/50">
          <Globe className="w-4 h-4" strokeWidth={1.75} aria-hidden />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">
            {labels.group}
          </span>
        </div>

        <div className="relative flex rounded-2xl border border-white/15 bg-white/[0.07] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          {LOCALES.map(({ code, flag }) => {
            const active = locale === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                aria-pressed={active}
                aria-label={labels[code]}
                className={cn(
                  "relative z-10 flex-1 flex items-center justify-center gap-2.5 py-3.5 px-3 rounded-xl transition-colors duration-300 cursor-pointer min-h-[52px]",
                  active ? "text-plum" : "text-white/55 hover:text-white/80"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="mobile-lang-pill"
                    className="absolute inset-0 rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative z-10 text-lg leading-none" aria-hidden>
                  {flag}
                </span>
                <span className="relative z-10 text-sm font-semibold tracking-wide">
                  {labels[code]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div role="group" aria-label={labels.group} className="flex items-center">
      <div className="flex rounded-full p-1 border border-lav-200/80 bg-lav-50/60 shadow-soft">
        {LOCALES.map(({ code, short }) => {
          const active = locale === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              aria-pressed={active}
              aria-label={labels[code]}
              className={cn(
                "relative min-w-[2.75rem] px-3 py-2 lg:py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer min-h-11 lg:min-h-0",
                active
                  ? "bg-white text-lav-700 shadow-soft ring-1 ring-lav-200/80"
                  : "text-plum/40 hover:text-plum/70"
              )}
            >
              {short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
