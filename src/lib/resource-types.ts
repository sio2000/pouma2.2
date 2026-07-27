import type { Resource, ResourceType } from "@/lib/db/types";
import { resolveMediaUrl } from "@/lib/upload-url";

export const RESOURCE_TYPES: ResourceType[] = ["pdf", "articles", "extras", "announcements"];

/** Legacy data may still use "videos" — map to extras */
export function normalizeResourceType(type: string): ResourceType {
  if (type === "videos") return "extras";
  if (RESOURCE_TYPES.includes(type as ResourceType)) return type as ResourceType;
  return "extras";
}

export function normalizeResource(resource: Resource): Resource {
  return {
    ...resource,
    type: normalizeResourceType(resource.type),
    fileUrl: resource.fileUrl ? resolveMediaUrl(resource.fileUrl) ?? resource.fileUrl : undefined,
    thumbnailUrl: resource.thumbnailUrl
      ? resolveMediaUrl(resource.thumbnailUrl) ?? resource.thumbnailUrl
      : undefined,
  };
}

export const TEXT_WRAP_CLASS =
  "break-words [overflow-wrap:anywhere] [word-break:break-word]";
