"use client";
import { useState } from "react";
import Link from "next/link";
import ResourceImage from "@/components/resources/ResourceImage";
import { useTranslations, useLocale } from "next-intl";
import type { Resource } from "@/lib/db/types";
import {
  getExternalArticleUrl,
  getExternalLinkLabel,
  getFileUrl,
  getThumbnailSrc,
  isPdfResource,
} from "@/lib/resources";
import { TEXT_WRAP_CLASS } from "@/lib/resource-types";
import MediaLightbox from "@/components/resources/MediaLightbox";

type Props = {
  resource: Resource;
};

export default function ResourceArticleView({ resource: r }: Props) {
  const t = useTranslations("resources.article");
  const tCat = useTranslations("resources.categories");
  const locale = useLocale();
  const thumbnailSrc = getThumbnailSrc(r);
  const fileUrl = getFileUrl(r);
  const externalHref = getExternalArticleUrl(r);
  const externalLabel = getExternalLinkLabel(r);
  const isPdf = isPdfResource(r) && fileUrl;

  const [lightbox, setLightbox] = useState<{ src: string; kind: "image" | "pdf" } | null>(null);

  const formattedDate = new Date(r.date).toLocaleDateString(locale === "el" ? "el-GR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const paragraphs = r.description.split(/\n\n+/).filter(Boolean);

  const openFullscreen = (src: string, kind: "image" | "pdf") => {
    setLightbox({ src, kind });
  };

  return (
    <div className="bg-ivory min-h-screen">
      <header className="relative pt-28 pb-10 px-6 border-b border-lav-100/80 bg-warm-mesh overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[400px] h-[320px] rounded-full bg-lav-200/20 blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10 min-w-0">
          <Link
            href={`/${locale}/resources`}
            className="inline-flex items-center gap-2 text-sm text-lav-600 hover:text-lav-800 mb-8 transition-colors"
          >
            <span aria-hidden>←</span>
            {t("back")}
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-lav-600 bg-lav-50 px-3 py-1 rounded-full border border-lav-100">
              {tCat(r.type)}
            </span>
            <time className="text-sm text-plum/40" dateTime={r.date}>
              {formattedDate}
            </time>
          </div>

          <h1
            className={`font-display font-light text-4xl md:text-5xl text-plum leading-tight tracking-tight ${TEXT_WRAP_CLASS}`}
          >
            {r.title}
          </h1>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16 min-w-0">
        {thumbnailSrc && (
          <button
            type="button"
            onClick={() => openFullscreen(thumbnailSrc, "image")}
            className="group relative w-full aspect-[16/10] rounded-3xl overflow-hidden border border-lav-100 shadow-medium mb-10 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-lav-400"
            aria-label={t("viewFullscreen")}
          >
            <ResourceImage
              src={thumbnailSrc}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
            <span className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/50 text-white text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 max-lg:opacity-100 transition-opacity">
              {t("clickToExpand")}
            </span>
          </button>
        )}

        <div className={`space-y-5 text-plum/70 text-lg leading-relaxed font-light min-w-0 ${TEXT_WRAP_CLASS}`}>
          {paragraphs.length > 1 ? (
            paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {p}
              </p>
            ))
          ) : (
            <p className="whitespace-pre-wrap">{r.description}</p>
          )}
        </div>

        {fileUrl && isPdf && (
          <div className="mt-12 rounded-3xl border border-lav-100 bg-white p-6 md:p-8 shadow-soft min-w-0">
            <h2 className="font-display text-xl text-plum mb-2">{t("attachment")}</h2>
            <p className="text-sm text-plum/40 mb-4">{t("clickToExpand")}</p>
            <button
              type="button"
              onClick={() => openFullscreen(fileUrl, "pdf")}
              className="relative w-full h-[min(50vh,400px)] rounded-2xl border border-lav-100 bg-lav-50/50 overflow-hidden cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-lav-400"
            >
              <iframe src={fileUrl} title={r.title} className="w-full h-full pointer-events-none" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                <span className="opacity-0 group-hover:opacity-100 max-lg:opacity-100 px-4 py-2 rounded-full bg-white/90 text-plum text-xs font-bold uppercase tracking-wider shadow-soft transition-opacity">
                  {t("viewFullscreen")}
                </span>
              </span>
            </button>
          </div>
        )}

        {fileUrl && !isPdf && thumbnailSrc !== fileUrl && (
          <button
            type="button"
            onClick={() => openFullscreen(fileUrl, "image")}
            className="group relative mt-12 w-full aspect-[4/3] rounded-3xl overflow-hidden border border-lav-100 shadow-soft cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-lav-400"
            aria-label={t("viewFullscreen")}
          >
            <ResourceImage src={fileUrl} alt="" fill className="object-contain bg-lav-50" sizes="720px" />
            <span className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/50 text-white text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 max-lg:opacity-100 transition-opacity">
              {t("clickToExpand")}
            </span>
          </button>
        )}

        {externalHref && externalLabel && (
          <div className="mt-12 pt-8 border-t border-lav-100 min-w-0">
            <p className="text-[10px] font-bold text-plum/35 uppercase tracking-widest mb-3">
              {t("externalLink")}
            </p>
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-lav-600 hover:text-lav-800 text-base font-medium transition-colors max-w-full ${TEXT_WRAP_CLASS}`}
            >
              <span aria-hidden className="flex-shrink-0">
                🔗
              </span>
              <span className="hover:underline underline-offset-2 break-all">{externalLabel}</span>
              <span className="text-plum/30 text-sm flex-shrink-0" aria-hidden>
                ↗
              </span>
            </a>
          </div>
        )}
      </article>

      <MediaLightbox
        open={lightbox !== null}
        onClose={() => setLightbox(null)}
        src={lightbox?.src ?? ""}
        kind={lightbox?.kind ?? "image"}
        title={r.title}
      />
    </div>
  );
}
