import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/types/locale";
import { buildMetadataFromSeo } from "@/lib/seo/pageSeo";
import { fetchSiteSeoByPageId } from "@/lib/seo/siteSeo";
import {
  METADATA_KEY_TO_SEO_PAGE,
  SITE_SEO_CONFIG,
  type MetadataKey,
} from "@/lib/seo/siteSeoConfig";

export type { MetadataKey };

/**
 * Localized metadata of a static page. The title, description and share image come from the
 * page's SEO document in the admin; empty fields fall back to the `metadata` messages.
 * A page without a document (order confirmation) uses the messages only.
 */
export async function buildPageMetadata(
  locale: Locale,
  key: MetadataKey,
  options: { absoluteTitle?: boolean } = {},
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const pageId = METADATA_KEY_TO_SEO_PAGE[key];

  const seo = pageId
    ? await fetchSiteSeoByPageId(pageId, locale).catch(() => null)
    : null;

  // The order confirmation page and the pages flagged `noindex` in the config
  const noindex = pageId
    ? Boolean(SITE_SEO_CONFIG[pageId].noindex)
    : key === "orderConfirmation";

  return buildMetadataFromSeo({
    seo,
    locale,
    path: pageId ? SITE_SEO_CONFIG[pageId].path : "/order-confirmation",
    defaultTitle: t(`${key}.title`),
    defaultDescription: t(`${key}.description`),
    absoluteTitle: options.absoluteTitle,
    robots: noindex ? { index: false, follow: false } : undefined,
  });
}
