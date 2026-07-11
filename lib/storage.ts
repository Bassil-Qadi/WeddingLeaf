import { BlobServiceClient } from "@azure/storage-blob";

const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER || "invitations";

let cachedContainerClient: ReturnType<
  BlobServiceClient["getContainerClient"]
> | null = null;

/**
 * Lazily creates (and caches) the blob container client, ensuring the
 * container exists with public read access on blobs so uploaded images are
 * directly usable as <img> src values.
 */
async function getContainerClient() {
  if (cachedContainerClient) return cachedContainerClient;

  if (!CONNECTION_STRING) {
    throw new Error(
      "Missing AZURE_STORAGE_CONNECTION_STRING environment variable.",
    );
  }

  const serviceClient = BlobServiceClient.fromConnectionString(
    CONNECTION_STRING,
  );
  const containerClient = serviceClient.getContainerClient(CONTAINER_NAME);
  await containerClient.createIfNotExists({ access: "blob" });

  cachedContainerClient = containerClient;
  return containerClient;
}

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB

/**
 * Uploads an image file under `<ownerId>/<uuid>.<ext>` and returns its public
 * URL. Throws on disallowed types/sizes so the route handler can turn that
 * into a 400 response.
 */
export async function uploadEventImage(
  file: File,
  ownerId: string,
): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("نوع الملف غير مدعوم. يُسمح فقط بصور JPEG أو PNG أو WebP أو AVIF");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("حجم الصورة يجب ألا يتجاوز 8 ميغابايت");
  }

  const containerClient = await getContainerClient();

  const extension = file.type.split("/")[1] ?? "jpg";
  const blobName = `${ownerId}/${crypto.randomUUID()}.${extension}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: file.type },
  });

  return blockBlobClient.url;
}
