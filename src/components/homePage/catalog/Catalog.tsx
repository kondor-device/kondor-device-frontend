import React from "react";
import CatalogSlider from "./CatalogSlider";
import { Category } from "@/types/category";
import { CategoryItem } from "@/types/categoryItem";
import { ProductItem } from "@/types/productItem";

interface CatalogProps {
  categories: CategoryItem[];
  shownOnAddonsProducts: ProductItem[];
}

export default function Catalog({
  categories,
  shownOnAddonsProducts,
}: CatalogProps) {
  if (!categories) {
    return null;
  }

  const sortedCategories = [...categories].sort((a, b) => a.pos - b.pos);

  return (
    <section
      id="catalog"
      className="pt-[60px] laptop:pt-[100px] scroll-mt-8 tabxl:scroll-mt-[63px]"
    >
      <ul className="flex flex-col gap-y-5 laptop:gap-y-[30px]">
        {sortedCategories.map(({ name, items }: Category, idx: number) => (
          <CatalogSlider
            key={idx}
            title={name}
            products={items}
            shownOnAddonsProducts={shownOnAddonsProducts}
          />
        ))}
      </ul>
    </section>
  );
}
