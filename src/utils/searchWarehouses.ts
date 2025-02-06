import axios from "axios";

export async function searchWarehouses(cityRef: string, query: string) {
  if (query.length < 1) return [];

  try {
    const { data } = await axios.post("/api/novaposhta/warehouses", {
      cityRef,
      query,
    });
    return data;
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    return [];
  }
}
