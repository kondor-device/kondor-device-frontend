import { getProducts } from "@/utils/getProducts";
import {
  GET_ALL_DATA_QUERY,
  GET_CATEGORIES_BY_SLUGS_QUERY,
} from "@/lib/datoCmsQueries";
import Catalog from "@/components/catalogPage/Catalog";

interface CatalogPageProps {
  searchParams: Promise<{ categories?: string | string[] }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { categories } = await searchParams;

  const categoryArray = Array.isArray(categories)
    ? categories
    : categories
    ? categories.split(",")
    : [];

  const res =
    categories === "all" || categories === "new"
      ? await getProducts(GET_ALL_DATA_QUERY)
      : await getProducts(GET_CATEGORIES_BY_SLUGS_QUERY, {
          categories: categoryArray,
        });

  console.log(res.data.allCategories);
  console.log(res.data.selectedCategories);

  return (
    <div className="pt-[82px] tabxl:pt-[113px]">
      <Catalog
        currentCategories={
          categories === "all" || categories === "new"
            ? res.data.allCategories
            : res.data.selectedCategories
        }
        allCategories={res.data.allCategories}
        shownOnAddons={res.data.shownOnAddons}
        categoryArray={categoryArray}
      />
    </div>
  );
}
