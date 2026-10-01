import { CategoryItem } from "@/types/categoryItem";

export interface CatalogListItem {
  title: string;
  category: string;
  icon: string;
}

interface CatalogLabels {
  all: string;
  new: string;
}

const searchParams =
  "&priceTo=4999&sort=default&priceFrom=499&availability=in-stock%2Cpre-order";

export function getCatalogList(
  categories: CategoryItem[],
  labels: CatalogLabels
): CatalogListItem[] {
  const categoriesList = categories
    ? [...categories]
        .sort((a, b) => a.pos - b.pos)
        .map((category) => ({
          title: category.name,
          category: category.slug,
          icon: category.image?.url,
        }))
    : [];

  const allCategoriesSlugs = categoriesList.map((c) => c.category).join(",");

  return [
    {
      title: labels.all,
      category: allCategoriesSlugs,
      icon: "/images/icons/all-products.svg",
    },
    ...categoriesList,
    {
      title: labels.new,
      category: allCategoriesSlugs.concat("&new=true"),
      icon: "/images/icons/sets.svg",
    },
  ];
}

// Одна конкретна категорія (без коми) веде на її власну сторінку
// /catalog/[category]; збірні пункти ("всі товари", "новинки") лишаються
// на /catalog з фільтром через query-параметри.
export function getCatalogHref(category: string) {
  return category.includes(",")
    ? `/catalog?type=${category}${searchParams}`
    : `/catalog/${category}`;
}
