import { CategoryItem } from "@/types/categoryItem";
import { ProductItem } from "@/types/productItem";

// Products of a category shown in its section on the home page: the ones that are not
// pinned to the hero (showonmain === false) and the available sets (the query does not
// return unavailable ones). One rule for the section and for the hero cards linking to it.
export const getHomeCatalogItems = (items: ProductItem[]) =>
  (items ?? []).filter(
    (item) => item.showonmain === false || item.kind === "bundle",
  );

// Ids of the categories that get a section (id="<category id>") in the home page catalog
export const getHomeCatalogCategoryIds = (
  categories: Pick<CategoryItem, "id" | "items">[] | undefined,
) =>
  new Set(
    (categories ?? [])
      .filter((category) => getHomeCatalogItems(category.items).length > 0)
      .map((category) => category.id),
  );

// A hero card needs a photo of the first colour
export const hasHeroPhoto = (product: ProductItem) =>
  Boolean(product.coloropts?.[0]?.photos?.[0]?.url);

// Hero cards: with a photo, and linking to a section that exists. A product of a category
// without a section on the home page (the category is empty or not shown) gets no card.
// A product without a category keeps its card and links to the catalog start.
export const getHeroProducts = (
  products: ProductItem[] | undefined,
  categories: Pick<CategoryItem, "id" | "items">[] | undefined,
) => {
  const sectionIds = getHomeCatalogCategoryIds(categories);

  return (products ?? []).filter(
    (product) =>
      hasHeroPhoto(product) &&
      (!product.cat?.id || sectionIds.has(product.cat.id)),
  );
};
