import type { ContactRequest, Resource } from "./types";
import { readJsonFile, writeJsonFile } from "./json-storage";
import { deleteResourceFile } from "./upload-resource-file";
import { normalizeResource } from "@/lib/resource-types";

const DEFAULT_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Foundation Reset — Workbook Εβδ. 1",
    description:
      "Υλικό προετοιμασίας για την πρώτη εβδομάδα του μονοπατιού Foundation Reset.",
    type: "pdf",
    date: "2025-01-10",
    published: true,
  },
  {
    id: "2",
    title: "5 τεχνικές για να μιλάς χωρίς φόβο",
    description: "Πώς να ξεπεράσεις τον φόβο της ομιλίας — πρακτικές, εφαρμόσιμες συμβουλές.",
    type: "articles",
    date: "2025-01-08",
    published: true,
  },
  {
    id: "3",
    title: "Pronunciation Masterclass — Μέρος 2",
    description: "Ανάλυση φωνημάτων και τεχνικές που βελτιώνουν άμεσα την προφορά σου.",
    type: "extras",
    date: "2025-01-05",
    published: true,
  },
  {
    id: "4",
    title: "Νέες θέσεις — Φεβρουάριος",
    description: "Ανοίγουν νέες θέσεις για τον Φεβρουάριο. Κράτησε τη δική σου εγκαίρως.",
    type: "announcements",
    date: "2025-01-15",
    published: true,
  },
];

export async function getContacts(): Promise<ContactRequest[]> {
  const contacts = await readJsonFile<ContactRequest[]>("contacts.json", []);
  return contacts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addContact(
  input: Omit<ContactRequest, "id" | "status" | "createdAt">
): Promise<ContactRequest> {
  const contacts = await getContacts();
  const entry: ContactRequest = {
    ...input,
    id: crypto.randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  contacts.unshift(entry);
  await writeJsonFile("contacts.json", contacts);
  return entry;
}

export async function updateContactStatus(
  id: string,
  status: ContactRequest["status"]
): Promise<ContactRequest | null> {
  const contacts = await getContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return null;
  contacts[index] = { ...contacts[index], status };
  await writeJsonFile("contacts.json", contacts);
  return contacts[index];
}

export async function getResources(includeUnpublished = false): Promise<Resource[]> {
  const resources = await readJsonFile<Resource[]>("resources.json", DEFAULT_RESOURCES);
  const sorted = [...resources]
    .map(normalizeResource)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (includeUnpublished) return sorted;
  return sorted.filter((r) => r.published);
}

export async function getResourceById(
  id: string,
  includeUnpublished = false
): Promise<Resource | null> {
  const resources = await getResources(includeUnpublished);
  return resources.find((r) => r.id === id) ?? null;
}

export async function addResource(
  input: Omit<Resource, "id" | "date" | "published"> & {
    id?: string;
    date?: string;
    published?: boolean;
  }
): Promise<Resource> {
  const resources = await readJsonFile<Resource[]>("resources.json", DEFAULT_RESOURCES);
  const entry: Resource = {
    id: input.id ?? crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    type: input.type,
    date: input.date ?? new Date().toISOString().split("T")[0],
    url: input.url?.trim() || undefined,
    fileUrl: input.fileUrl?.trim() || undefined,
    thumbnailUrl: input.thumbnailUrl?.trim() || undefined,
    published: input.published ?? true,
  };
  resources.unshift(entry);
  await writeJsonFile("resources.json", resources);
  return entry;
}

export async function updateResource(
  id: string,
  input: {
    title?: string;
    description?: string;
    type?: Resource["type"];
    url?: string | null;
    fileUrl?: string | null;
    thumbnailUrl?: string | null;
    published?: boolean;
  }
): Promise<Resource | null> {
  const resources = await readJsonFile<Resource[]>("resources.json", DEFAULT_RESOURCES);
  const index = resources.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = resources[index];
  const updated: Resource = {
    ...current,
    title: input.title !== undefined ? input.title.trim() : current.title,
    description:
      input.description !== undefined ? input.description.trim() : current.description,
    type: input.type ?? current.type,
    url:
      input.url !== undefined
        ? input.url
          ? String(input.url).trim()
          : undefined
        : current.url,
    fileUrl:
      input.fileUrl !== undefined
        ? input.fileUrl
          ? String(input.fileUrl).trim()
          : undefined
        : current.fileUrl,
    thumbnailUrl:
      input.thumbnailUrl !== undefined
        ? input.thumbnailUrl
          ? String(input.thumbnailUrl).trim()
          : undefined
        : current.thumbnailUrl,
    published: input.published ?? current.published,
  };

  resources[index] = updated;
  await writeJsonFile("resources.json", resources);
  return updated;
}

export async function deleteResource(id: string): Promise<boolean> {
  const resources = await readJsonFile<Resource[]>("resources.json", DEFAULT_RESOURCES);
  const target = resources.find((r) => r.id === id);
  const next = resources.filter((r) => r.id !== id);
  if (next.length === resources.length) return false;
  if (target) await deleteResourceFile(target.fileUrl, target.thumbnailUrl);
  await writeJsonFile("resources.json", next);
  return true;
}
