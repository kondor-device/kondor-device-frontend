import axios from "axios";

export async function searchCities(query: string) {
  if (query.length < 1) return [];

  try {
    const { data } = await axios.post("/api/novaposhta/cities", { query });
    return data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}
