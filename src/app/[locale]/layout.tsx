import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import WorkshopPopup from "@/components/workshops/WorkshopPopup";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("home", locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider key={locale} messages={messages} locale={locale}>
      <JsonLd locale={locale} />
      <div id="site-content">
        <div className="grain-overlay max-lg:hidden" aria-hidden />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WorkshopPopup />
      </div>
    </NextIntlClientProvider>
  );
}
