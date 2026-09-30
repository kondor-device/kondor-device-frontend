import { cache } from "react";
import { client } from "@/lib/sanityClient";
import { GET_SITE_SEO_QUERY } from "@/lib/queries";
import type { Locale } from "@/types/locale";
import type { PageSeo } from "@/types/seo";
import type { SiteSeoPageId } from "@/lib/seo/siteSeoConfig";

// SEO block of a static page from the admin. The tags let the Sanity webhook reset it.
export const fetchSiteSeoByPageId = cache(
  async (pageId: SiteSeoPageId, locale: Locale): Promise<PageSeo | null> => {
    const row = await client.fetch<{ seo?: PageSeo | null } | null>(
      GET_SITE_SEO_QUERY,
      { documentId: pageId, locale },
      { next: { revalidate: 3600, tags: ["site-seo", `site-seo:${pageId}`] } },
    );

    return row?.seo ?? null;
  },
);
