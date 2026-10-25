import { cache } from "react";
import { getLocale } from "next-intl/server";
import { client } from "@/lib/sanityClient";

// One request per render: generateMetadata and the page itself ask for the same data.
// `cache` compares arguments by reference, so the variables are passed as a string.
const fetchCached = cache(async (query: string, variables: string, locale: string) => {
  const data = await client.withConfig({ useCdn: false }).fetch(
    query, { locale, ...JSON.parse(variables) }, { cache: "no-store" },
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
