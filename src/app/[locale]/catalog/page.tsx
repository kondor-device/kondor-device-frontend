import { GET_CATEGORIES_BY_SLUGS_QUERY } from "@/lib/queries";
import { getProducts } from "@/utils/getProducts";
import Catalog from "@/components/catalogPage/Catalog";
import { Suspense } from "react";
import Loader from "@/components/shared/loader/Loader";

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
      <Suspense fallback={<Loader />}>
        <Catalog
          currentCategories={res.data.selectedCategories}
          allCategories={res.data.allCategories}
          shownOnAddons={res.data.shownOnAddons}
        />
      </Suspense>
    </div>
  );
}
