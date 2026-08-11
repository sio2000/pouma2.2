"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { BroadcastIcon } from "@/components/home/HomeIcons";
import { apiFetch, parseJsonResponse } from "@/lib/api-client";
import type { WorkshopView } from "@/lib/workshops/types";

/**
 * The seminars card. It sits in the middle of the shorter programme row but is
 * deliberately the odd one out — a violet plate among the pale ones — because
 * it is not a programme you enrol in, it is the noticeboard: live seminars and
 * webinars, announced as they come.
 *
 * When a workshop is featured it links straight to it; otherwise it sends the
 * reader to the contact page to ask about the next one.
 */
export default function SeminarsCard({ delay = 0 }: { delay?: number }) {
  const t = useTranslations("home.programs.seminars");
  const locale = useLocale();
  const [workshop, setWorkshop] = useState<WorkshopView | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/api/workshops?scope=featured");
        const data = await parseJsonResponse<{ workshop: WorkshopView | null }>(res);
        if (!cancelled) setWorkshop(data.workshop);
      } catch {
        /* non-critical — the card still points somewhere useful */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const href = workshop
    ? `/${locale}/workshop/${workshop.slug}`
    : `/${locale}/contact`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="home-card-dark group relative flex flex-col rounded-xl border border-[color:var(--home-brass)]/70 bg-home-ink p-6 text-center shadow-[0_18px_44px_rgba(66,39,120,0.3)]"
    >
      {/* A brass thread along the top edge that keeps travelling — the card is
          an announcement, so it should look alive. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--home-brass-soft)] to-transparent"
        animate={{ opacity: [0.25, 0.9, 0.25] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Live label with a breathing dot. */}
      <span className="mb-5 inline-flex items-center justify-center gap-2 self-center rounded-full border border-[color:var(--home-brass)]/45 px-3 py-1">
        <motion.span
          aria-hidden
          className="block h-1.5 w-1.5 rounded-full bg-[color:var(--home-brass-soft)]"
          animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.25, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-brass-soft text-[9.5px] font-semibold uppercase tracking-[0.16em]">
          {t("label")}
        </span>
      </span>

      <span className="home-medallion mx-auto h-12 w-12 border-[color:var(--home-brass)]">
        <BroadcastIcon className="h-[23px] w-[23px]" />
      </span>

      <h3 className="home-display mt-4 text-[1.15rem] text-white">{t("title")}</h3>

      <p className="mt-3 flex-1 text-[12.5px] leading-[1.65] text-white/68">{t("desc")}</p>

      <Link
        href={href}
        className="text-brass-soft mt-5 inline-flex items-center justify-center gap-2 text-[12.5px] font-semibold transition-colors hover:text-white"
      >
        {t("cta")}
        <svg
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      </Link>
    </motion.article>
  );
}
