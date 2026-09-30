/**
 * SEO documents of the static pages (kondor-device-admin, schemaTypes/siteSeoPages.ts).
 * The document `_id` equals its type name; `path` is the locale-agnostic page path.
 * `noindex` pages stay out of the search index and out of the sitemap, but keep their
 * SEO document (title, description). The order confirmation page has no document and
 * is never indexed.
 */
export const SITE_SEO_PAGE_IDS = [
  "seoHomePage",
  "seoCatalogPage",
  "seoAboutPage",
  "seoDeliveryPage",
  "seoReturnsPage",
  "seoWarrantyPage",
  "seoPolicyPage",
] as const;

export type SiteSeoPageId = (typeof SITE_SEO_PAGE_IDS)[number];

/** Keys of the `metadata` messages namespace (title / description fallbacks). */
export type MetadataKey =
  | "home"
  | "catalog"
  | "about"
  | "delivery"
  | "returns"
  | "warranty"
  | "policy"
  | "orderConfirmation";

export const SITE_SEO_CONFIG: Record<
  SiteSeoPageId,
  { path: string; metadataKey: MetadataKey; noindex?: boolean }
> = {
  seoHomePage: { path: "/", metadataKey: "home" },
  seoCatalogPage: { path: "/catalog", metadataKey: "catalog" },
  seoAboutPage: { path: "/about", metadataKey: "about" },
  seoDeliveryPage: { path: "/delivery", metadataKey: "delivery" },
  seoReturnsPage: { path: "/returns", metadataKey: "returns" },
  seoWarrantyPage: { path: "/warranty", metadataKey: "warranty" },
  seoPolicyPage: { path: "/policy", metadataKey: "policy", noindex: true },
};

export const METADATA_KEY_TO_SEO_PAGE: Partial<
  Record<MetadataKey, SiteSeoPageId>
> = Object.fromEntries(
  (
    Object.entries(SITE_SEO_CONFIG) as [
      SiteSeoPageId,
      { metadataKey: MetadataKey },
    ][]
  ).map(([pageId, { metadataKey }]) => [metadataKey, pageId]),
);
