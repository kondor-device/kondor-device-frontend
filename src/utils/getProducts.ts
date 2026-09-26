import { getLocale } from "next-intl/server";
import { fetchSanityData } from "./fetchSanityData";

// Server-only: passes the request locale as $locale, so GROQ queries return localized fields
export async function getProducts(
  query: string,
  variables: Record<string, unknown> = {}
) {
  const locale = await getLocale();

  return fetchSanityData(query, { locale, ...variables });
}
