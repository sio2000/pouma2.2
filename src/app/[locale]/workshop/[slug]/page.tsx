import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { getWorkshopViewBySlug } from "@/lib/workshops/service";
import { workshopEventJsonLd, workshopMetadata } from "@/lib/workshops/seo";
import WorkshopLanding from "@/components/workshops/WorkshopLanding";

export const dynamic = "force-dynamic";

// Deduped within a request (metadata + page share one fetch).
const loadWorkshop = cache((slug: string) => getWorkshopViewBySlug(slug));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const workshop = await loadWorkshop(slug);
  if (!workshop) {
    return { title: "Workshop | The Pouma Academy", robots: { index: false, follow: false } };
  }
  return workshopMetadata(workshop, locale);
}

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const workshop = await loadWorkshop(slug);
  if (!workshop) notFound();

  const jsonLd = workshopEventJsonLd(workshop, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorkshopLanding workshop={workshop} locale={locale} />
    </>
  );
}
