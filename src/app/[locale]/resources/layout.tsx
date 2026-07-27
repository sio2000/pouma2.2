import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("resources", locale);
}

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
