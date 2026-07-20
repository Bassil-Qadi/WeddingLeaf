import { v2 as cloudinary } from "cloudinary";

/**
 * Images live in Cloudinary rather than in the database: the bytes are served
 * straight off its CDN as ordinary public URLs, so a guest loading an
 * invitation never touches our functions or Atlas. Everything downstream —
 * the event document, the invitation templates — only ever handles the URL
 * string, which is what keeps this module the single place that knows the
 * backend.
 */

const CLOUDINARY_URL = process.env.CLOUDINARY_URL;

/** Everything we upload lives under this prefix, per owner. */
const ROOT_FOLDER = "weddingleaf";

let configured = false;

function configure() {
  if (configured) return;

  if (!CLOUDINARY_URL) {
    throw new Error("Missing CLOUDINARY_URL environment variable.");
  }

  // Parsed explicitly rather than leaning on the SDK's implicit env lookup,
  // which only happens at import time and fails confusingly ("must supply
  // cloud_name") when the variable loads a moment later.
  const parsed = CLOUDINARY_URL.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!parsed) {
    throw new Error(
      "CLOUDINARY_URL must look like cloudinary://<api_key>:<api_secret>@<cloud_name>.",
    );
  }

  const [, apiKey, apiSecret, cloudName] = parsed;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  configured = true;
}

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB

/**
 * Uploads an image under `weddingleaf/<ownerId>/` and returns its public URL.
 * Throws on disallowed types/sizes so the route handler can turn that into a
 * 400 response.
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

  configure();

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `${ROOT_FOLDER}/${ownerId}`,
          resource_type: "image",
          // The couple's original is the archive copy; delivery variants are
          // derived per-request from the URL, so nothing is baked in here.
          overwrite: false,
        },
        (error, uploaded) => {
          if (error) return reject(new Error(error.message));
          if (!uploaded) return reject(new Error("تعذّر رفع الصورة"));
          resolve(uploaded as { secure_url: string });
        },
      );
      stream.end(buffer);
    },
  );

  return result.secure_url;
}

/**
 * Recovers the Cloudinary public id from a delivery URL.
 *
 * A URL looks like `.../image/upload/v1712345678/weddingleaf/<owner>/<id>.jpg`
 * and the id we need is everything after the version, minus the extension.
 * Returns null for anything that isn't one of our Cloudinary URLs — notably
 * the Azure URLs on events created before this migration, which must be left
 * alone rather than mistaken for a deletable public id.
 */
export function publicIdFromUrl(url: string): string | null {
  const match = url.match(
    /res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)$/,
  );
  if (!match) return null;

  const withoutExtension = match[1].replace(/\.[a-zA-Z0-9]+$/, "");
  return withoutExtension.startsWith(`${ROOT_FOLDER}/`)
    ? withoutExtension
    : null;
}

/**
 * Deletes an uploaded image. Scoped to `ownerId`: the owner's id is part of
 * every public id we mint, so a request can only ever remove its own files
 * even though the caller passes an arbitrary URL.
 *
 * Deliberately forgiving — a missing or foreign URL is a no-op rather than an
 * error, because failing to delete a file must never block the user's actual
 * edit. Storage is metered, so this is what keeps removed images from
 * accruing cost forever.
 */
export async function deleteEventImage(
  url: string,
  ownerId: string,
): Promise<boolean> {
  const publicId = publicIdFromUrl(url);
  if (!publicId) return false;
  if (!publicId.startsWith(`${ROOT_FOLDER}/${ownerId}/`)) return false;

  configure();

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });
    return result.result === "ok";
  } catch {
    return false;
  }
}
