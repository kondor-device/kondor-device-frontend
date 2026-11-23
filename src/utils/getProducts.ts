import { cache } from "react";
import { getLocale } from "next-intl/server";
import { client } from "@/lib/sanityClient";

// Page data is kept in the Next.js data cache for up to a day. Freshness comes from the
// Sanity webhook (/api/revalidate): publishing an item, bundle, category, SEO page or review
// calls revalidatePath for the affected pages, which also drops these cached fetches.
//
// useCdn stays false on purpose: right after a publish the Sanity CDN can still serve the old
// version for a few seconds, and the webhook-triggered re-render must not cache that for a day.
// The live API is hit only on such re-renders, not on every page view.
//
// Do not switch this back to `cache: "no-store"`: that made every page view (and every bot
// hit) send several uncached Sanity API requests and render the page as a Vercel function,
// which blew through the Sanity API quota and the Vercel function-duration budget (Nov 2026).
const PAGE_DATA_REVALIDATE_SECONDS = 86400;

// One request per render: generateMetadata and the page itself ask for the same data.
// `cache` compares arguments by reference, so the variables are passed as a string.
const fetchCached = cache(async (query: string, variables: string, locale: string) => {
  const data = await client.withConfig({ useCdn: false }).fetch(
    query,
    { locale, ...JSON.parse(variables) },
    { next: { revalidate: PAGE_DATA_REVALIDATE_SECONDS } },
  );
  return { data };
});

// Server-only: passes the request locale as $locale, so GROQ queries return localized fields
export async function getProducts(
  query: string,
  variables: Record<string, unknown> = {}
) {
  const locale = await getLocale();

  return fetchCached(query, JSON.stringify(variables), locale);
}
