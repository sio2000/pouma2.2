import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { getPrivacyContent } from "@/lib/legal/privacy";
import { siteConfig } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = getPrivacyContent(locale);
  return {
    title: `${c.title} | ${siteConfig.name}`,
    description: c.subtitle,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/privacy`,
      languages: {
        el: `${siteConfig.url}/el/privacy`,
        en: `${siteConfig.url}/en/privacy`,
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const c = getPrivacyContent(locale);

  return (
    <div className="bg-ivory min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-section-elevated px-4 sm:px-6 pt-28 sm:pt-32 lg:pt-40 pb-12 sm:pb-16">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-20 right-0 w-[420px] h-[420px] rounded-full bg-lav-100/60 blur-3xl" />
          <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-gold-200/30 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-8 h-px bg-gold-400/70" />
            <span className="text-eyebrow text-lav-600">GDPR · EU 2016/679</span>
            <span className="w-8 h-px bg-gold-400/70" />
          </div>
          <h1 className="font-display font-light text-4xl sm:text-5xl text-plum tracking-tight leading-[1.05]">
            {c.title}
          </h1>
          <p className="text-body-premium text-base sm:text-lg mt-5 max-w-2xl mx-auto">
            {c.subtitle}
          </p>
          <span className="inline-flex items-center gap-2 mt-6 rounded-full bg-white border border-lav-100 px-4 py-1.5 text-xs text-plum/55 shadow-soft">
            {c.updatedLabel}: <strong className="text-plum/75 font-medium">{c.updated}</strong>
          </span>
        </div>
      </section>

      {/* Sections */}
      <section className="px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto space-y-10 sm:space-y-12">
          {c.sections.map((section, i) => (
            <article key={i} className="relative">
              <h2 className="font-display text-xl sm:text-2xl text-plum leading-snug mb-4 flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex-shrink-0" aria-hidden />
                {section.heading}
              </h2>
              {section.body?.map((p, j) => (
                <p key={j} className="text-body-premium text-[15px] sm:text-base leading-relaxed mb-3 pl-5">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-3 space-y-2.5 pl-5">
                  {section.bullets.map((b, k) => (
                    <li key={k} className="flex items-start gap-3 text-body-premium text-[15px] leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-lav-400 flex-shrink-0" aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
