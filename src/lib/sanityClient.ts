import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "qmszlzqu",
  dataset: "production",
  apiVersion: "2025-11-11",
  useCdn: true,
});
