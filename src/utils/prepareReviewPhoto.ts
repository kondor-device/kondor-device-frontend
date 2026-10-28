import { REVIEW_PHOTO_MAX_BYTES } from "@/lib/reviewPhotos";

export async function prepareReviewPhoto(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) throw new Error("Invalid image");
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > 50_000_000) throw new Error("Image too large");
    const ratio = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.82, 0.65, 0.45]) {
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", quality));
      if (blob && blob.size <= REVIEW_PHOTO_MAX_BYTES) return new File([blob], "review.webp", { type: blob.type });
    }
    throw new Error("Image too large");
  } finally { bitmap.close(); }
}
