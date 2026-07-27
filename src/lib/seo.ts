import type { Metadata } from "next";

export const siteConfig = {
  name: "The Pouma Academy",
  tagline: {
    el: "Η φωνή σου, αναδειγμένη",
    en: "Your voice, elevated",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://poumaacademy.gr",
  email: "ask@thepoumaacademy.com",
  phone: "+30 210 000 0000",
  locale: "el_GR",
  alternateLocale: "en_US",
  twitterHandle: "@poumaacademy",
  logoPath: "/finallogo.png",
  ogImagePath: "/opengraph-image",
} as const;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, siteConfig.url).toString();
}

export function ogImageUrl(): string {
  return absoluteUrl(siteConfig.ogImagePath);
}

export function logoUrl(): string {
  return absoluteUrl(siteConfig.logoPath);
}

const sharedKeywords = [
  "αγγλικά Αθήνα",
  "μαθήματα αγγλικών Αθήνα",
  "English coaching Athens",
  "communication coaching",
  "The Pouma Academy",
  "Pouma Academy",
  "μεταμόρφωση αγγλικά",
  "executive English",
  "παρουσίαση αγγλικά",
  "Δήμητρα Γιαννουπλάκη",
  "boutique ακαδημία αγγλικών",
];

const titles: Record<string, { el: string; en: string }> = {
  home: {
    el: "The Pouma Academy | Μεταμόρφωση μέσω Αγγλικών & Επικοινωνίας",
    en: "The Pouma Academy | Transformation Through English & Communication",
  },
  programs: {
    el: "Προγράμματα Εξέλιξης | The Pouma Academy",
    en: "Evolution Programs | The Pouma Academy",
  },
  about: {
    el: "Η Δήμητρα | The Pouma Academy",
    en: "Dimitra | The Pouma Academy",
  },
  contact: {
    el: "Επικοινωνία & Δωρεάν Αξιολόγηση | The Pouma Academy",
    en: "Contact & Free Assessment | The Pouma Academy",
  },
  resources: {
    el: "Η τάξη μας | The Pouma Academy",
    en: "Our Class | The Pouma Academy",
  },
};

const descriptions: Record<string, { el: string; en: string }> = {
  home: {
    el: "Boutique ακαδημία μεταμόρφωσης στην Αθήνα. Εξειδικευμένα προγράμματα αγγλικών, communication coaching και επαγγελματική παρουσία σε μικρές ομάδες 3–4 ατόμων.",
    en: "Boutique transformation academy in Athens. Specialized English programs, communication coaching, and professional presence in groups of 3–4.",
  },
  programs: {
    el: "Επίλεξε το πρόγραμμα εξέλιξής σου: Foundation Reset, Voice Accelerator, Professional Excellence ή Custom Journey. Αγγλικά με στόχο την πραγματική έκφραση.",
    en: "Choose your evolution path: Foundation Reset, Voice Accelerator, Professional Excellence, or Custom Journey. English focused on real expression.",
  },
  about: {
    el: "Γνώρισε τη Δήμητρα Γιαννουπλάκη — communication coach με 12+ χρόνια εμπειρίας στη μεταμόρφωση ανθρώπων μέσω των αγγλικών.",
    en: "Meet Dimitra Giannouplaki — communication coach with 12+ years transforming people through English.",
  },
  contact: {
    el: "Κλείσε δωρεάν αξιολόγηση. Η πρώτη γνωριμία είναι χωρίς δέσμευση — ανακαλύψτε μαζί πού βρίσκεστε και πού θέλετε να φτάσετε.",
    en: "Book a free assessment. Your first introduction is commitment-free — discover where you are and where you want to go.",
  },
  resources: {
    el: "Η τάξη μας — αποκλειστικό υλικό για σπουδαστές της The Pouma Academy. Άρθρα, βίντεο και υλικό μελέτης εκτός τάξης.",
    en: "Our Class — exclusive materials for The Pouma Academy students. Articles, extras, and study resources beyond class.",
  },
};

function openGraphImages(title: string) {
  return [
    {
      url: ogImageUrl(),
      width: 1200,
      height: 630,
      alt: title,
      type: "image/png",
    },
    {
      url: logoUrl(),
      width: 512,
      height: 512,
      alt: siteConfig.name,
      type: "image/jpeg",
    },
  ];
}

export function pageMetadata(
  page: keyof typeof titles,
  locale: string
): Metadata {
  const lang = locale === "en" ? "en" : "el";
  const title = titles[page][lang];
  const description = descriptions[page][lang];
  const path = page === "home" ? "" : `/${page}`;
  const canonical = `${siteConfig.url}/${locale}${path}`;

  return {
    title,
    description,
    keywords: sharedKeywords,
    authors: [{ name: "Dimitra Giannouplaki", url: `${siteConfig.url}/${locale}/about` }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "education",
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
      alternateLocale: lang === "el" ? ["en_US"] : ["el_GR"],
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: openGraphImages(title),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl()],
      creator: siteConfig.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "og:logo": logoUrl(),
    },
  };
}

export function articleMetadata({
  title,
  description,
  locale,
  path,
}: {
  title: string;
  description: string;
  locale: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const canonical = `${siteConfig.url}/${locale}${path}`;
  const lang = locale === "en" ? "en" : "el";

  return {
    title: fullTitle,
    description: description.slice(0, 160),
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical },
    openGraph: {
      type: "article",
      locale: lang === "el" ? "el_GR" : "en_US",
      url: canonical,
      siteName: siteConfig.name,
      title: fullTitle,
      description: description.slice(0, 200),
      images: openGraphImages(fullTitle),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description.slice(0, 200),
      images: [ogImageUrl()],
    },
    robots: { index: false, follow: false },
  };
}

export function organizationJsonLd(locale: string) {
  const isEl = locale === "el";
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: logoUrl(),
    image: [logoUrl(), ogImageUrl()],
    email: siteConfig.email,
    telephone: siteConfig.phone,
    description: isEl
      ? "Boutique ακαδημία μεταμόρφωσης — αγγλικά, communication coaching και επαγγελματική παρουσία."
      : "Boutique transformation academy — English, communication coaching, and professional presence.",
    slogan: isEl ? siteConfig.tagline.el : siteConfig.tagline.en,
    areaServed: { "@type": "Country", name: "Greece" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Athens",
      addressCountry: "GR",
    },
    knowsLanguage: ["el", "en"],
    inLanguage: locale,
    sameAs: [],
  };
}

export function websiteJsonLd(locale: string) {
  const isEl = locale === "el";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: isEl
      ? descriptions.home.el
      : descriptions.home.en,
    inLanguage: locale,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: "%s",
  },
  description: descriptions.home.el,
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "el_GR",
    images: openGraphImages(siteConfig.name),
  },
  twitter: {
    card: "summary_large_image",
    creator: siteConfig.twitterHandle,
    images: [ogImageUrl()],
  },
  icons: {
    icon: [{ url: siteConfig.logoPath, type: "image/png" }],
    apple: [{ url: siteConfig.logoPath, type: "image/png" }],
  },
  other: {
    "og:logo": logoUrl(),
  },
};
