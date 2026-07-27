import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ResourceArticleView from "@/components/resources/ResourceArticleView";
import { getResourceById } from "@/lib/db/file-store";
import { articleMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const resource = await getResourceById(id);
  if (!resource) return { title: "The Pouma Academy" };
  return articleMetadata({
    title: resource.title,
    description: resource.description,
    locale,
    path: `/resources/${id}`,
  });
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const resource = await getResourceById(id);
  if (!resource) notFound();

  return <ResourceArticleView resource={resource} />;
}
