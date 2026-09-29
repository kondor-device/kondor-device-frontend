import { fetchSanityData } from "./fetchSanityData";

export async function getBundlesByIds(
  query: string,
  bundleIds: string[],
  locale?: string
) {
  return fetchSanityData(query, { ids: bundleIds, locale });
}
