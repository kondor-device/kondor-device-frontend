import "server-only";
import { createClient } from "next-sanity";

// Клієнт із правом запису — лише для route handlers (токен не потрапляє в браузер).
// Без CDN: після запису читаємо свіжі дані.
export const writeClient = createClient({
  projectId: "qmszlzqu",
  dataset: "production",
  apiVersion: "2025-11-11",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});
