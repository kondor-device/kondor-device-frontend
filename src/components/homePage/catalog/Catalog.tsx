import React from "react";
import CatalogSlider from "./CatalogSlider";
import { getProducts } from "@/utils/getProducts";
import { ProductItem } from "@/types/productItem";
import { ALL_ITEMS_QUERY } from "@/lib/datoCmsQueries";

export default async function Catalog() {
  const res = await getProducts(ALL_ITEMS_QUERY);

  if (!res.data?.allCategories) {
    return null;
  }

  const categories = res.data.allCategories;

  return (
    <section
      id="catalog"
      className="pt-[60px] laptop:pt-[100px] scroll-mt-8 tabxl:scroll-mt-[63px]"
    >
      <ul className="flex flex-col gap-y-5 laptop:gap-y-[30px]">
        {categories.map(
          (
            { name, items }: { name: string; items: ProductItem[] },
            idx: number
          ) => (
            <CatalogSlider key={idx} title={name} products={items} />
          )
        )}
      </ul>
    </section>
  );
}
