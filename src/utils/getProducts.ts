import { getLocale } from "next-intl/server";
import { client } from "@/lib/sanityClient";

// Server-only: passes the request locale as $locale, so GROQ queries return localized fields
export async function getProducts(
  query: string,
  variables: Record<string, unknown> = {}
) {
  const locale = await getLocale();

  // Read on this deployment, bypassing CDN/Next caches after moderation.
  // The old proxy URL pointed at production, whose cache cannot be invalidated here.
  const data = await client.withConfig({ useCdn: false }).fetch(
    query, { locale, ...variables }, { cache: "no-store" },
  );
  return { data };
}
