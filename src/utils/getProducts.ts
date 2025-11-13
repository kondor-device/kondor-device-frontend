import { fetchSanityData } from "./fetchSanityData";

export async function getProducts(
  query: string,
  variables: Record<string, unknown> = {}
) {
  return fetchSanityData(query, variables);
}
