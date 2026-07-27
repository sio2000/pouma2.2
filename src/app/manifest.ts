import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Pouma",
    description:
      "Boutique ακαδημία μεταμόρφωσης — αγγλικά, communication coaching και επαγγελματική παρουσία στην Αθήνα.",
    start_url: "/el",
    display: "standalone",
    background_color: "#f8f4fc",
    theme_color: "#7c5fa8",
    lang: "el",
    icons: [
      {
        src: siteConfig.logoPath,
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
