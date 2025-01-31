import React from "react";
import CatalogSlider from "./CatalogSlider";
import { performRequest } from "@/app/api/datocms/request";
import { ALL_ITEMS_QUERY } from "@/lib/datoCmsQueries";
import { ProductItem } from "@/types/productItem";

const getAllProducts = async () => {
  try {
    const data = await performRequest({
      query: ALL_ITEMS_QUERY,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export default async function Catalog() {
  const res = await getAllProducts();
  const categories = res.data.allCategories;

  return (
    <section
      id="catalog"
      className="pt-[60px] laptop:pt-[100px] scroll-mt-8 tabxl:scroll-mt-[63px]"
    >
      <ul>
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
