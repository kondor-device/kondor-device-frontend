import { getProducts } from "@/utils/getProducts";
import { GET_CATEGORIES_BY_SLUGS_QUERY } from "@/lib/datoCmsQueries";
import Catalog from "@/components/catalogPage/Catalog";

interface CatalogPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { type } = await searchParams;

  const categoryArray = type ? type.split(",") : [];

  const res = await getProducts(GET_CATEGORIES_BY_SLUGS_QUERY, {
    categories: categoryArray,
  });

  return (
    <div className="pt-[82px] tabxl:pt-[113px]">
      <Catalog
        currentCategories={res.data.selectedCategories}
        allCategories={res.data.allCategories}
        shownOnAddons={res.data.shownOnAddons}
        categoryArray={categoryArray}
      />
    </div>
  );
}
