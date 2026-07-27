import {
  filenameFromUploadUrl,
  getLegacyUploadStore,
  getUploadStore,
  legacyUploadKeyFromFilename,
  uploadKeyFromFilename,
} from "@/lib/db/upload-storage";

/** Stored via setJSON — same API as resources.json (proven on Netlify). */
type StoredUploadJson = {
  v: 1;
  contentType: string;
  data: string;
};

/** Netlify Blobs JSON entries are limited; keep raw file under ~4MB. */
export const MAX_BLOB_UPLOAD_BYTES = 4 * 1024 * 1024;

function guessContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "application/pdf";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  return "application/octet-stream";
}

async function blobToBuffer(data: unknown): Promise<Buffer | null> {
  if (!data) return null;
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  if (data instanceof ArrayBuffer) return Buffer.from(data);
  if (typeof data === "string") {
    try {
      return Buffer.from(data, "base64");
    } catch {
      return Buffer.from(data, "utf8");
    }
  }
  if (typeof Blob !== "undefined" && data instanceof Blob) {
    const ab = await data.arrayBuffer();
    return Buffer.from(ab);
  }
  return null;
}

function parseStoredJson(raw: unknown, filename: string): { body: Buffer; contentType: string } | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as StoredUploadJson;
  if (record.v !== 1 || !record.data) return null;
  try {
    const body = Buffer.from(record.data, "base64");
    if (!body.length) return null;
    return {
      body,
      contentType: record.contentType || guessContentType(filename),
    };
  } catch {
    return null;
  }
}

async function readJsonFromStore(
  store: Awaited<ReturnType<typeof getUploadStore>>,
  key: string,
  filename: string
): Promise<{ body: Buffer; contentType: string } | null> {
  try {
    const raw = await store.get(key, { type: "json" });
    return parseStoredJson(raw, filename);
  } catch {
    return null;
  }
}

/** Legacy binary blob entries */
async function readBinaryFromStore(
  store: Awaited<ReturnType<typeof getUploadStore>>,
  key: string,
  filename: string
): Promise<{ body: Buffer; contentType: string } | null> {
  try {
    const withMeta = await store.getWithMetadata(key);
    if (withMeta?.data) {
      const body = await blobToBuffer(withMeta.data);
      if (body?.length) {
        const contentType =
          (withMeta.metadata?.contentType as string | undefined) ?? guessContentType(filename);
        return { body, contentType };
      }
    }
  } catch {
    // fall through
  }

  try {
    const raw = await store.get(key, { type: "arrayBuffer" });
    const body = await blobToBuffer(raw);
    if (body?.length) {
      return { body, contentType: guessContentType(filename) };
    }
  } catch {
    return null;
  }

  return null;
}

export async function readUploadFromBlob(
  filename: string
): Promise<{ body: Buffer; contentType: string } | null> {
  const primary = await getUploadStore();
  const key = uploadKeyFromFilename(filename);

  const fromJson = await readJsonFromStore(primary, key, filename);
  if (fromJson) return fromJson;

  const fromBinary = await readBinaryFromStore(primary, key, filename);
  if (fromBinary) return fromBinary;

  try {
    const legacy = await getLegacyUploadStore();
    const legacyKey = legacyUploadKeyFromFilename(filename);
    return (
      (await readJsonFromStore(legacy, legacyKey, filename)) ??
      (await readBinaryFromStore(legacy, legacyKey, filename))
    );
  } catch {
    return null;
  }
}

export async function writeUploadToBlob(
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  if (buffer.length > MAX_BLOB_UPLOAD_BYTES) {
    throw new Error(
      `Το αρχείο υπερβαίνει το όριο ${Math.round(MAX_BLOB_UPLOAD_BYTES / (1024 * 1024))}MB για αποθήκευση στο Netlify.`
    );
  }

  const store = await getUploadStore();
  const key = uploadKeyFromFilename(filename);
  const payload: StoredUploadJson = {
    v: 1,
    contentType,
    data: buffer.toString("base64"),
  };

  await store.setJSON(key, payload);

  const verify = await readJsonFromStore(store, key, filename);
  if (!verify?.body?.length) {
    throw new Error("Η αποθήκευση του αρχείου απέτυχε — δοκίμασε ξανά.");
  }
}

export async function deleteUploadFromBlob(fileUrl?: string): Promise<void> {
  const name = filenameFromUploadUrl(fileUrl);
  if (!name) return;

  const keys = [uploadKeyFromFilename(name), legacyUploadKeyFromFilename(name)];

  try {
    const primary = await getUploadStore();
    await Promise.all(keys.map((key) => primary.delete(key).catch(() => undefined)));
  } catch {
    // ignore
  }

  try {
    const legacy = await getLegacyUploadStore();
    await legacy.delete(legacyUploadKeyFromFilename(name)).catch(() => undefined);
  } catch {
    // ignore
  }
}
