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

/**
 * Gradient of the landing header: the formula is fixed, only the four colours come from the
 * admin. Missing colours fall back to the darkest of the filled ones (or the default dark).
 */
export function heroGradient(colors: (string | null)[]) {
  const filled = colors.filter((color): color is string => Boolean(color));
  const fallback = filled[0] ?? FALLBACK_COLOR;
  const [c1, c2, c3, c4] = [0, 1, 2, 3].map((i) => colors[i] ?? fallback);

  return `linear-gradient(308.65deg, ${c1} 18.05%, ${c2} 48.49%, ${c3} 75.83%, ${c4} 101.59%)`;
}
