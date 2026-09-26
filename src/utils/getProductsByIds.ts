import { fetchSanityData } from "./fetchSanityData";

export async function getProductsByIds(
  query: string,
  productIds: string[],
  locale?: string
) {
  return fetchSanityData(query, { ids: productIds, locale });
}
