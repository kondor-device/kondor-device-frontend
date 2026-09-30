import JsonLd from "@/components/shared/JsonLd";
import { fetchSchemaJsonLd } from "@/lib/seo/schemaJson";
import type { PageSeo } from "@/types/seo";

/** JSON-LD uploaded to the SEO block of a page in the admin, if there is one. */
export default async function SchemaJsonFromSeo({
  seo,
}: {
  seo?: PageSeo | null;
}) {
  const data = await fetchSchemaJsonLd(seo?.schemaJsonUrl);

  return data ? <JsonLd data={data} /> : null;
}
