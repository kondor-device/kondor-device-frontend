import axios from "axios";

export async function searchCities(query: string) {
  try {
    const { data } = await axios.post("/api/novaposhta/cities", { query });
    return data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}
