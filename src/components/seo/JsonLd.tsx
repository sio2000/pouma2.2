import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function JsonLd({ locale }: { locale: string }) {
  const schemas = [organizationJsonLd(locale), websiteJsonLd(locale)];

  return (
    <>
      {schemas.map((data) => (
        <script
          key={data["@type"] as string}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
