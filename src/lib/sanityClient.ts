import { createClient } from "next-sanity";

// Local development only: SANITY_PREVIEW_DRAFTS=true makes the site read unpublished drafts
// too (needs SANITY_WRITE_TOKEN), so new content can be checked without publishing it to the
// dataset the live site reads. Never set it in production.
const previewDrafts =
  process.env.SANITY_PREVIEW_DRAFTS === "true" &&
  Boolean(process.env.SANITY_WRITE_TOKEN);

export const client = createClient({
  projectId: "qmszlzqu",
  dataset: "production",
  apiVersion: "2025-11-11",
  useCdn: !previewDrafts,
  ...(previewDrafts && {
    perspective: "drafts" as const,
    token: process.env.SANITY_WRITE_TOKEN,
  }),
});
