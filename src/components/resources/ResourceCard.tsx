"use client";
import Link from "next/link";
import ResourceImage from "@/components/resources/ResourceImage";
import { useTranslations, useLocale } from "next-intl";
import type { Resource } from "@/lib/db/types";
import {
  getExternalArticleUrl,
  getExternalLinkLabel,
  getResourceReadPath,
  getThumbnailSrc,
  isPdfResource,
} from "@/lib/resources";
import { TEXT_WRAP_CLASS } from "@/lib/resource-types";

type Props = {
  resource: Resource;
  typeIcon: React.ReactNode;
  typeAccent: string;
  typeBar: string;
  categoryLabel: string;
  formattedDate: string;
};

export default function ResourceCard({
  resource: r,
  typeIcon,
  typeAccent,
  typeBar,
  categoryLabel,
  formattedDate,
}: Props) {
  const t = useTranslations("resources");
  const locale = useLocale();
  const readPath = getResourceReadPath(locale, r.id);
  const externalHref = getExternalArticleUrl(r);
  const externalLabel = getExternalLinkLabel(r);
  const thumbnailSrc = getThumbnailSrc(r);
  const showPdfThumb = !thumbnailSrc && isPdfResource(r) && r.fileUrl;

  return (
    <article className="group relative flex flex-col h-full bg-white border border-lav-100 rounded-[1.5rem] overflow-hidden hover:border-lav-300/70 shadow-soft hover:shadow-medium transition-all duration-400">
      <div className={`absolute inset-x-0 top-0 h-1 z-10 ${typeBar}`} />

      {thumbnailSrc && (
        <div className="relative aspect-[16/9] bg-lav-50 border-b border-lav-100 overflow-hidden">
          <ResourceImage
            src={thumbnailSrc}
            alt=""
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

      {showPdfThumb && (
        <div className="relative aspect-[16/9] bg-gradient-to-br from-lav-100 to-lav-50 border-b border-lav-100 flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center text-lav-600">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-lav-600/70">PDF</span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-7 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-5">
          {!thumbnailSrc && !showPdfThumb && (
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 ${typeAccent}`}
            >
              {typeIcon}
            </div>
          )}
          {(thumbnailSrc || showPdfThumb) && <div className="flex-1" />}
          <div className="text-right shrink-0">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-lav-600/80 mb-1">
              {categoryLabel}
            </span>
            <time className="block text-xs text-plum/30 font-medium" dateTime={r.date}>
              {formattedDate}
            </time>
          </div>
        </div>

        <h3 className={`font-display text-xl text-plum mb-2 tracking-tight leading-snug ${TEXT_WRAP_CLASS}`}>
          {r.title}
        </h3>
        <p
          className={`text-plum/48 text-sm leading-relaxed font-light flex-1 line-clamp-5 ${TEXT_WRAP_CLASS}`}
        >
          {r.description}
        </p>

        <div className="mt-6 pt-5 border-t border-lav-100/90 flex flex-col gap-3">
          {externalHref && externalLabel && (
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center gap-2 text-xs text-lav-600 hover:text-lav-800 transition-colors truncate min-h-11 py-2 w-full rounded-xl hover:bg-lav-50/80"
              title={externalHref}
            >
              <span aria-hidden>🔗</span>
              <span className="truncate hover:underline underline-offset-2">{externalLabel}</span>
            </a>
          )}

          <Link
            href={readPath}
            className="relative z-20 w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-lav-600 text-white text-[11px] font-bold uppercase tracking-[0.16em] hover:bg-lav-700 active:scale-[0.99] transition-all shadow-soft"
          >
            {t("readMore")}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
