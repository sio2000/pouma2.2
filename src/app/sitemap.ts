import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

const routes = ["", "/programs", "/about", "/contact", "/resources"] as const;
const locales = ["el", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: {
          el: `${base}/el${route}`,
          en: `${base}/en${route}`,
        },
      },
    }))
  );
}
