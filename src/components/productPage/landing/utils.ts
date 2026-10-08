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

// Default stops and angle of the nine-colour ribbon gradient (from the design)
const RIBBON_STOPS = [
  1.85, 41.26, 94.29, 142.68, 188.41, 232.82, 278.56, 318.99, 374.76,
];
const RIBBON_ANGLE = 89.64;

/** Ribbon gradient from up to nine colours; empty slots are skipped, null when nothing is filled.
 * Positions (%) and angle come from the admin, the defaults above are used for what is empty */
export function ribbonGradient(
  colors: (string | null)[],
  positions: (number | null)[] = [],
  angle: number | null = null,
) {
  const stops = colors.flatMap((color, index) =>
    color ? [`${color} ${positions[index] ?? RIBBON_STOPS[index]}%`] : [],
  );

  return stops.length > 0
    ? `linear-gradient(${angle ?? RIBBON_ANGLE}deg, ${stops.join(", ")})`
    : null;
}

/** Sanity asset urls end with `-<width>x<height>.<ext>`: lets next/image reserve the right space */
export function getImageSize(image: LandingImage) {
  const match = image.url.match(/-(\d+)x(\d+)\.\w+(?:\?.*)?$/);

  return match
    ? { width: Number(match[1]), height: Number(match[2]) }
    : { width: 1200, height: 800 };
}

/** Background of the header: the formula is fixed, only the four colours come from the admin */
export function heroGradient(colors: (string | null)[]) {
  const filled = colors.filter((color): color is string => Boolean(color));
  const fallback = filled[0] ?? FALLBACK_COLOR;
  const [c1, c2, c3, c4] = [0, 1, 2, 3].map((i) => colors[i] ?? fallback);

  return `linear-gradient(308.65deg, ${c1} 18.05%, ${c2} 48.49%, ${c3} 75.83%, ${c4} 101.59%)`;
}

/** Background of the full-width photo block: two colours from the admin; angle and stops (%) are
 * optional in the admin, the defaults are the first design */
export function bannerGradient(
  from: string | null,
  to: string | null,
  angle: number | null = null,
  fromPosition: number | null = null,
  toPosition: number | null = null,
) {
  const start = from ?? to ?? FALLBACK_COLOR;
  const end = to ?? from ?? FALLBACK_COLOR;

  return `linear-gradient(${angle ?? 119.61}deg, ${start} ${fromPosition ?? 47.56}%, ${end} ${toPosition ?? 128.27}%)`;
}

/** Background of the header on mobile: its own fixed formula and four colours from the admin */
export function heroMobileGradient(colors: (string | null)[]) {
  const filled = colors.filter((color): color is string => Boolean(color));
  const fallback = filled[0] ?? FALLBACK_COLOR;
  const [c1, c2, c3, c4] = [0, 1, 2, 3].map((i) => colors[i] ?? fallback);

  return `linear-gradient(351.48deg, ${c1} 19.96%, ${c2} 42.22%, ${c3} 66.9%, ${c4} 99.12%)`;
}
