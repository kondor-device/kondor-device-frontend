import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/types/locale";
import type { PageSeo } from "@/types/seo";
import { getLocalizedPath } from "@/utils/getLocalizedPath";
import {
  DEFAULT_OG_IMAGE,
  HREFLANG,
  OG_LOCALE,
  SITE_ALLOW_INDEXING,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/constants";

export type BuildMetadataParams = {
  seo?: PageSeo | null;
  locale: Locale;
  /** Locale-agnostic pathname starting with `/`, e.g. `/`, `/catalog`, `/catalog/mishi/kondor-astra-pro`. */
  path: string;
  defaultTitle: string;
  defaultDescription: string;
  /** Absolute title: skips the layout `%s | Kondor Device` template. */
  absoluteTitle?: boolean;
  /** Set to keep the page out of the index (order confirmation, ...). */
  robots?: Metadata["robots"];
  /** Product / set photo, used when the CMS has no share image for the page. */
  fallbackImageUrl?: string | null;
};

export function absoluteUrl(pathname: string): string {
  if (!pathname || pathname === "/") return SITE_URL;
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

/** Canonical + hreflang (uk-UA, ru-UA, x-default) alternates of a page. */
export function buildLanguageAlternates(
  path: string,
  locale: Locale,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};

  for (const item of routing.locales) {
    languages[HREFLANG[item]] = absoluteUrl(getLocalizedPath(item, path));
  }
  languages["x-default"] = absoluteUrl(
    getLocalizedPath(routing.defaultLocale, path),
  );

  return {
    canonical: absoluteUrl(getLocalizedPath(locale, path)),
    languages,
  };
}

// Share image: the one uploaded for the page (cropped to 1200×630 by the Sanity CDN),
// then the product photo, then the site default.
function resolveOgImage(
  seo?: PageSeo | null,
  fallbackImageUrl?: string | null,
) {
  const cmsUrl = seo?.opengraphImage?.url?.trim();
  if (cmsUrl) {
    return {
      url: `${cmsUrl}?w=1200&h=630&fit=crop&auto=format`,
      width: 1200,
      height: 630,
    };
  }

  const fallback = fallbackImageUrl?.trim();
  if (fallback) return { url: fallback };

  return {
    url: absoluteUrl(DEFAULT_OG_IMAGE.path),
    width: DEFAULT_OG_IMAGE.width,
    height: DEFAULT_OG_IMAGE.height,
  };
}

// The CMS title is written complete: do not add the brand twice
function endsWithBrand(title: string) {
  return (
    title === SITE_NAME ||
    [" | ", " — ", " - "].some((sep) => title.endsWith(`${sep}${SITE_NAME}`))
  );
}

/** Plain text of a description, cut at a word boundary. */
export function truncateText(text: string, max = 160): string {
  const value = text.replace(/\s+/g, " ").trim();
  if (value.length <= max) return value;

  const cut = value.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max / 2 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:—-]+$/, "")}…`;
}

/**
 * Converts localized SEO data into Next.js Metadata. Empty CMS fields fall back to
 * `defaultTitle` / `defaultDescription`. Always emits canonical, hreflang, Open Graph and Twitter.
 */
export function buildMetadataFromSeo({
  seo,
  locale,
  path,
  defaultTitle,
  defaultDescription,
  absoluteTitle = false,
  robots,
  fallbackImageUrl,
}: BuildMetadataParams): Metadata {
  const metaTitle = seo?.metaTitle?.trim() || defaultTitle;
  const metaDescription = seo?.metaDescription?.trim() || defaultDescription;
  const ogTitle = seo?.opengraphTitle?.trim() || metaTitle;
  const ogDescription = seo?.opengraphDescription?.trim() || metaDescription;
  const ogImage = resolveOgImage(seo, fallbackImageUrl);
  const alternates = buildLanguageAlternates(path, locale);
  const keywords = seo?.keywords?.filter(Boolean);

  return {
    title:
      absoluteTitle || endsWithBrand(metaTitle)
        ? { absolute: metaTitle }
        : metaTitle,
    description: metaDescription,
    ...(keywords?.length ? { keywords } : {}),
    alternates,
    robots: SITE_ALLOW_INDEXING ? robots : { index: false, follow: false },
    // openGraph of a page replaces the layout one, so it is filled in full
    openGraph: {
      type: "website",
      title: ogTitle,
      description: ogDescription,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales
        .filter((item) => item !== locale)
        .map((item) => OG_LOCALE[item]),
      url: alternates.canonical as string,
      images: [{ ...ogImage, alt: seo?.opengraphImage?.alt?.trim() || ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage.url],
    },
  };
}
