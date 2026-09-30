import { getLocale } from "next-intl/server";
import SchemaJsonFromSeo from "@/components/seo/SchemaJsonFromSeo";
import { fetchSiteSeoByPageId } from "@/lib/seo/siteSeo";
import type { SiteSeoPageId } from "@/lib/seo/siteSeoConfig";
import type { Locale } from "@/types/locale";

/** JSON-LD uploaded to the SEO document of a static page (seoHomePage, seoAboutPage, ...). */
export default async function SitePageSeo({
  pageId,
}: {
  pageId: SiteSeoPageId;
}) {
  const locale = (await getLocale()) as Locale;
  const seo = await fetchSiteSeoByPageId(pageId, locale).catch(() => null);

  return <SchemaJsonFromSeo seo={seo} />;
}
