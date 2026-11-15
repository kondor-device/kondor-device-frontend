import type { ImageLoaderProps } from "next/image";

/**
 * Custom next/image loader that resizes images on the Sanity image CDN
 * instead of Vercel's `/_next/image` optimiser.
 *
 * Vercel Hobby only includes 1,000 optimised source images per account; once
 * that is crossed the client gets billed. Routing every Sanity image through
 * `cdn.sanity.io` (which resizes and reformats for free) keeps the whole site
 * off that quota. Non-Sanity sources (local /public assets, legacy hosts) are
 * returned untouched, so they are served directly and never hit the Vercel
 * optimiser either.
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;

  const url = new URL(src);
  const p = url.searchParams;
  const origW = Number(p.get("w")) || 0;
  const origH = Number(p.get("h")) || 0;

  p.set("w", String(width));
  p.set("q", String(quality ?? 75));
  p.set("auto", "format");

  if (origW && origH) {
    // The URL already carries an explicit crop box (urlFor().width().height()).
    // Scale height with the requested width so the crop aspect is preserved
    // across every srcset entry; keep any existing fit/rect/hotspot.
    p.set("h", String(Math.round((width * origH) / origW)));
  } else {
    // Width-only: height follows the source aspect, never upscale.
    p.delete("h");
    if (!p.has("fit")) p.set("fit", "max");
  }

  url.search = p.toString();
  return url.toString();
}
