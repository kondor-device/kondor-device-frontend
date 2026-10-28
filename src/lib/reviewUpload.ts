import sharp from "sharp";
import { REVIEW_BODY_MAX_BYTES, REVIEW_PHOTO_LIMIT, REVIEW_PHOTO_MAX_BYTES } from "./reviewPhotos";

export class InvalidReviewUpload extends Error {}

export async function readReviewSubmission(request: Request) {
  if (Number(request.headers.get("content-length")) > REVIEW_BODY_MAX_BYTES) throw new InvalidReviewUpload();
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > REVIEW_BODY_MAX_BYTES) { await reader.cancel(); throw new InvalidReviewUpload(); }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
  }
  const bytes = Buffer.concat(chunks);
  const contentType = request.headers.get("content-type") || "";
  if (contentType.startsWith("multipart/form-data")) {
    const form = await new Response(bytes, { headers: { "content-type": contentType } }).formData();
    const photos = form.getAll("photos");
    if (photos.length > REVIEW_PHOTO_LIMIT || photos.some(p => typeof p === "string" || p.size > REVIEW_PHOTO_MAX_BYTES || p.size === 0)) throw new InvalidReviewUpload();
    const fields: Record<string, unknown> = {};
    for (const key of ["name", "phone", "rating", "message", "itemId", "locale", "website", "startedAt"]) {
      const value = form.get(key);
      if (value !== null && typeof value !== "string") throw new InvalidReviewUpload();
      if (value !== null) fields[key] = value;
    }
    if (fields.rating !== undefined) fields.rating = Number(fields.rating);
    if (fields.startedAt !== undefined) fields.startedAt = Number(fields.startedAt);
    return { fields, photos: photos as File[] };
  }
  const fields = JSON.parse(bytes.toString("utf8"));
  if (!fields || typeof fields !== "object" || Array.isArray(fields) || fields.photos !== undefined) throw new InvalidReviewUpload();
  return { fields: fields as Record<string, unknown>, photos: [] as File[] };
}

// Decode and re-encode every photo: MIME/extension alone are not trusted.
// Metadata (including GPS/EXIF) is stripped; animated/vector files are refused.
export async function normalizeReviewPhoto(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > REVIEW_PHOTO_MAX_BYTES) throw new InvalidReviewUpload();
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const image = sharp(bytes, { limitInputPixels: 20_000_000, failOn: "error" });
    const metadata = await image.metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format || "") || (metadata.pages || 1) > 1) throw new InvalidReviewUpload();
    const output = await image.rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    if (output.length > REVIEW_PHOTO_MAX_BYTES) throw new InvalidReviewUpload();
    return output;
  } catch { throw new InvalidReviewUpload(); }
}
