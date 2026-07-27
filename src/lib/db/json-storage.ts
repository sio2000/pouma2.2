import { promises as fs } from "fs";
import path from "path";
import { getBlobStore } from "@/lib/db/netlify-store";
import { isNetlifyRuntime, useNetlifyBlobs } from "@/lib/db/runtime-env";

export { useNetlifyBlobs };

function getFileDataDir() {
  if (isNetlifyRuntime()) {
    return path.join("/tmp", "pouma-data");
  }
  return path.join(process.cwd(), "data");
}

async function getDataStore() {
  return getBlobStore("pouma-data");
}

async function ensureDataDir() {
  await fs.mkdir(getFileDataDir(), { recursive: true });
}

async function readJsonFromDisk<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(getFileDataDir(), filename);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    try {
      await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf-8");
    } catch {
      // Read-only or ephemeral FS — return fallback without failing the request.
    }
    return fallback;
  }
}

async function writeJsonToDisk<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(getFileDataDir(), filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  if (useNetlifyBlobs()) {
    try {
      const store = await getDataStore();
      const data = await store.get(filename, { type: "json" });
      if (data === null) {
        try {
          await store.setJSON(filename, fallback);
        } catch {
          // Blobs unavailable — fall through to disk.
          return readJsonFromDisk(filename, fallback);
        }
        return fallback;
      }
      return data as T;
    } catch {
      return readJsonFromDisk(filename, fallback);
    }
  }

  return readJsonFromDisk(filename, fallback);
}

export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  if (useNetlifyBlobs()) {
    try {
      const store = await getDataStore();
      await store.setJSON(filename, data);
      return;
    } catch {
      // Blobs unavailable — persist under /tmp for this instance.
    }
  }

  await writeJsonToDisk(filename, data);
}
