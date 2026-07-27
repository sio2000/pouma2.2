/**
 * SEO for workshop landing pages — metadata (title/description/OpenGraph/
 * canonical/hreflang) and schema.org Event JSON-LD.
 */

import type { Metadata } from "next";
import { absoluteUrl, ogImageUrl, siteConfig } from "@/lib/seo";
import { resolveMediaUrl } from "@/lib/upload-url";
import { getWorkshopEnd, getWorkshopStart } from "@/lib/workshops/status";
import type { Workshop, WorkshopView } from "@/lib/workshops/types";

function bannerOgUrl(workshop: Workshop): string {
  const resolved = resolveMediaUrl(workshop.bannerUrl);
  if (!resolved) return ogImageUrl();
  if (resolved.startsWith("http://") || resolved.startsWith("https://")) return resolved;
  return absoluteUrl(resolved);
}

function workshopDescription(workshop: Workshop): string {
  const base =
    workshop.subtitle?.trim() ||
    workshop.description?.trim() ||
    (siteConfig.tagline.el as string);
  return base.replace(/\s+/g, " ").slice(0, 200);
}

export function workshopPath(locale: string, slug: string): string {
  return `/${locale}/workshop/${slug}`;
}

export function workshopMetadata(workshop: Workshop, locale: string): Metadata {
  const lang = locale === "en" ? "en" : "el";
  const title = `${workshop.title} | The Pouma Academy`;
  const description = workshopDescription(workshop);
  const path = `/workshop/${workshop.slug}`;
  const canonical = `${siteConfig.url}/${locale}${path}`;
  const image = bannerOgUrl(workshop);

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
      languages: {
        el: `${siteConfig.url}/el${path}`,
        en: `${siteConfig.url}/en${path}`,
        "x-default": `${siteConfig.url}/el${path}`,
      },
    },
    openGraph: {
      type: "website",
      locale: lang === "el" ? "el_GR" : "en_US",
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: workshop.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: siteConfig.twitterHandle,
    },
    robots: {
      index: workshop.active,
      follow: true,
      googleBot: {
        index: workshop.active,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function workshopEventJsonLd(workshop: WorkshopView, locale: string) {
  const url = `${siteConfig.url}${workshopPath(locale, workshop.slug)}`;
  const statusMap: Record<WorkshopView["status"], string> = {
    upcoming: "https://schema.org/EventScheduled",
    live: "https://schema.org/EventScheduled",
    completed: "https://schema.org/EventScheduled",
  };

  return {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: workshop.title,
    description: workshopDescription(workshop),
    startDate: getWorkshopStart(workshop).toISOString(),
    endDate: getWorkshopEnd(workshop).toISOString(),
    eventStatus: statusMap[workshop.status],
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    image: [bannerOgUrl(workshop)],
    url,
    location: {
      "@type": "VirtualLocation",
      url,
    },
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: locale,
  };
}
