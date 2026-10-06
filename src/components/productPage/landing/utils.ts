import { LandingImage } from "@/types/productItem";

/** Fallback for a colour that is not filled in the admin */
export const FALLBACK_COLOR = "#191919";

/** Accent used when the admin has no accent colour for a text block */
export const FALLBACK_ACCENT = "#bf71ff";

export const hasText = (value: string | null | undefined): value is string =>
  typeof value === "string" && value.trim().length > 0;

/** Gradient from the two colours of the admin; a single colour gives a flat fill */
export function gradient(from: string | null, to: string | null, angle = 135) {
  const start = from ?? to ?? FALLBACK_COLOR;
  const end = to ?? from ?? FALLBACK_COLOR;

  return `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)`;
}

/** Sanity asset urls end with `-<width>x<height>.<ext>`: lets next/image reserve the right space */
export function getImageSize(image: LandingImage) {
  const match = image.url.match(/-(\d+)x(\d+)\.\w+(?:\?.*)?$/);

  return match
    ? { width: Number(match[1]), height: Number(match[2]) }
    : { width: 1200, height: 800 };
}
