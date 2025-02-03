import React from "react";
import CatalogSlider from "./CatalogSlider";
import { Category } from "@/types/category";
import { CategoryItem } from "@/types/categoryItem";

interface CatalogProps {
  categories: CategoryItem[];
}

export default function Catalog({ categories }: CatalogProps) {
  return (
    <section
      id="catalog"
      className="pt-[60px] laptop:pt-[100px] scroll-mt-8 tabxl:scroll-mt-[63px]"
    >
      <ul className="flex flex-col gap-y-5 laptop:gap-y-[30px]">
        {categories.map(({ name, items }: Category, idx: number) => (
          <CatalogSlider key={idx} title={name} products={items} />
        ))}
      </ul>
    </section>
  );
}
