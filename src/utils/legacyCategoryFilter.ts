import { LEGACY_CATEGORY_REDIRECTS } from "@/constants/legacyRedirects";
import { PageSearchParams } from "@/utils/withQuery";

// The catalog filter keeps the chosen categories in ?type=a,b. Old links (Google still shows
// /catalog?type=klaviaturi-orion&…) name categories that were merged since, and the catalog
// then renders an empty list. Replaces them with the current ones and drops duplicates.
// A slug that is a category today is never replaced, even if it is also in the list of
// merged ones (a category created again under its old slug must stay filterable).
export function replaceMergedCategories(
  type: string,
  currentCategorySlugs: string[],
): string {
  const current = new Set(currentCategorySlugs);
  const slugs = type
    .split(",")
    .map((slug) =>
      current.has(slug) ? slug : (LEGACY_CATEGORY_REDIRECTS.get(slug) ?? slug),
    );

  return Array.from(new Set(slugs)).join(",");
}

// The visitor's query string with the category filter brought up to date
export function withCurrentCategoryFilter(
  query: PageSearchParams,
  currentCategorySlugs: string[],
): PageSearchParams {
  return typeof query.type === "string"
    ? {
        ...query,
        type: replaceMergedCategories(query.type, currentCategorySlugs),
      }
    : query;
}
