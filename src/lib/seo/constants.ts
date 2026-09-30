import type { Locale } from "@/types/locale";

/** Canonical site origin (no trailing slash). The same address serves previews, see next.config.mjs. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.kondor.ua"
).replace(/\/+$/, "");

export const SITE_NAME = "Kondor Device";

/**
 * Preview deployments and local dev must not be indexed. Written so that production
 * stays indexable even if the Vercel variable is missing.
 */
export const SITE_ALLOW_INDEXING =
  process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development";

/** Default share image (`public/opengraph-image.jpg`), 1200×630. */
export const DEFAULT_OG_IMAGE = {
  path: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
};

export const OG_LOCALE: Record<Locale, string> = {
  uk: "uk_UA",
  ru: "ru_UA",
};

export const HREFLANG: Record<Locale, string> = {
  uk: "uk-UA",
  ru: "ru-UA",
};
