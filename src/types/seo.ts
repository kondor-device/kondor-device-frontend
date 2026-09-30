/**
 * Localized SEO payload: the `seoSettings` block of a category / SEO page document
 * (kondor-device-admin), or the flat seoTitle / seoDescription / seoImage fields
 * of a product or a set, brought to the same shape. Already resolved to the request locale.
 */
export type PageSeoImage = {
  url?: string | null;
  alt?: string | null;
};

export type PageSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[] | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: PageSeoImage | null;
  /** CDN URL of an uploaded schema.org JSON file, if present. */
  schemaJsonUrl?: string | null;
};
