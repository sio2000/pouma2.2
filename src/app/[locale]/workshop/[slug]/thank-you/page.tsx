import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { getWorkshopViewBySlug } from "@/lib/workshops/service";
import WorkshopThankYou from "@/components/workshops/WorkshopThankYou";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ευχαριστούμε | The Pouma Academy",
  robots: { index: false, follow: false },
};

export default async function WorkshopThankYouPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Best-effort details — the confirmation still renders if the lookup fails.
  const workshop = await getWorkshopViewBySlug(slug);

  return <WorkshopThankYou workshop={workshop} locale={locale} />;
}
