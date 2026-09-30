import { cache } from "react";
import { getLocale } from "next-intl/server";
import { fetchSanityData } from "./fetchSanityData";

// One request per render: generateMetadata and the page itself ask for the same data.
// `cache` compares arguments by reference, so the variables are passed as a string.
const fetchCached = cache((query: string, variables: string, locale: string) =>
  fetchSanityData(query, { locale, ...JSON.parse(variables) })
);

// Server-only: passes the request locale as $locale, so GROQ queries return localized fields
export async function getProducts(
  query: string,
  variables: Record<string, unknown> = {}
) {
  const locale = await getLocale();

  return fetchCached(query, JSON.stringify(variables), locale);
}
