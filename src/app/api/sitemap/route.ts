import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { client } from "@/lib/sanityClient";
import { GET_SITEMAP_DATA_QUERY } from "@/lib/queries";
import { absoluteUrl, buildLanguageUrls } from "@/lib/seo/pageSeo";
import { SITE_SEO_CONFIG, SITE_SEO_PAGE_IDS } from "@/lib/seo/siteSeoConfig";
import { getLocalizedPath } from "@/utils/getLocalizedPath";

// Served at /sitemap.xml (rewrite in next.config.mjs). Static, like the product feeds: it is
// rebuilt hourly, and right away by POST /api/revalidate when a product, set, category or SEO
// page changes in Sanity.
export const dynamic = "force-static";
export const revalidate = 3600;

interface SitemapDoc {
  slug: string;
  categorySlug?: string;
  updatedAt?: string;
}

interface SitemapData {
  categories: SitemapDoc[];
  products: SitemapDoc[];
  bundles: SitemapDoc[];
  pages: { _id: string; updatedAt?: string }[];
}

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq: string;
  priority: number;
}

const PAGE_PRIORITY: Record<string, { changefreq: string; priority: number }> =
  {
    "/": { changefreq: "weekly", priority: 1.0 },
    "/catalog": { changefreq: "weekly", priority: 1.0 },
    "/about": { changefreq: "monthly", priority: 0.9 },
    "/delivery": { changefreq: "monthly", priority: 0.9 },
    "/returns": { changefreq: "monthly", priority: 0.5 },
    "/warranty": { changefreq: "monthly", priority: 0.5 },
    "/policy": { changefreq: "monthly", priority: 0.5 },
  };

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function buildEntries(data: SitemapData): SitemapEntry[] {
  const pageUpdatedAt = new Map(data.pages.map((p) => [p._id, p.updatedAt]));

  // The order confirmation page is not listed: it is not indexed
  const staticPages = SITE_SEO_PAGE_IDS.map((pageId) => {
    const { path } = SITE_SEO_CONFIG[pageId];
    return { path, lastmod: pageUpdatedAt.get(pageId), ...PAGE_PRIORITY[path] };
  });

  const categories = data.categories.map(({ slug, updatedAt }) => ({
    path: `/catalog/${slug}`,
    lastmod: updatedAt,
    changefreq: "weekly",
    priority: 0.8,
  }));

  const products = [...data.products, ...data.bundles].map(
    ({ slug, categorySlug, updatedAt }) => ({
      path: `/catalog/${categorySlug}/${slug}`,
      lastmod: updatedAt,
      changefreq: "weekly",
      priority: 0.7,
    }),
  );

  return [...staticPages, ...categories, ...products];
}

// One <url> per language version, each one listing all versions (hreflang)
function buildXml(entries: SitemapEntry[]): string {
  const urls = entries.flatMap(({ path, lastmod, changefreq, priority }) => {
    const alternates = Object.entries(buildLanguageUrls(path))
      .map(
        ([hreflang, href]) =>
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}"/>`,
      )
      .join("\n");

    return routing.locales.map(
      (locale) => `  <url>
    <loc>${escapeXml(absoluteUrl(getLocalizedPath(locale, path)))}</loc>${
      lastmod
        ? `\n    <lastmod>${new Date(lastmod).toISOString()}</lastmod>`
        : ""
    }
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${alternates}
  </url>`,
    );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}

export async function GET() {
  try {
    const data = await client.fetch<SitemapData>(GET_SITEMAP_DATA_QUERY, {
      pageIds: [...SITE_SEO_PAGE_IDS],
    });

    return new NextResponse(buildXml(buildEntries(data)), {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch (error) {
    // No half-empty sitemap: better an error than an empty file cached for an hour
    console.error("Failed to generate the sitemap:", error);
    return NextResponse.json(
      { error: "Failed to generate the sitemap" },
      { status: 500 },
    );
  }
}
