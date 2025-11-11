import { fetchSanityData } from "./fetchSanityData";

export async function getPromocode(query: string, code: string) {
  return fetchSanityData(query, { code });
}
