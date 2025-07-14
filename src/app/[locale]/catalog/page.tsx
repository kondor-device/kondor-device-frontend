import { getProducts } from "@/utils/getProducts";
import { GET_CATEGORIES_BY_SLUGS_QUERY } from "@/lib/datoCmsQueries";
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

  const res = await getProducts(GET_CATEGORIES_BY_SLUGS_QUERY, {
    categories: categoryArray,
  });

  console.log(res);

  return (
    <div className="pt-[82px] tabxl:pt-[113px]">
      <Catalog
        currentCategories={res.data.allCategories}
        shownOnAddons={res.data.shownOnAddons}
      />
    </div>
  );
}
