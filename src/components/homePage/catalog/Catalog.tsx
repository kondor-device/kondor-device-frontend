import React from "react";
import CatalogSlider from "./CatalogSlider";
import { Category } from "@/types/category";
import { CategoryItem } from "@/types/categoryItem";

interface CatalogProps {
  categories: CategoryItem[];
}

export default function Catalog({ categories }: CatalogProps) {
  if (!categories) {
    return null;
  }

  const sortedCategories = [...categories].sort((a, b) => a.pos - b.pos);

  return (
    <section id="catalog" className="pt-[60px] laptop:pt-[100px]">
      <ul className="flex flex-col gap-y-5 laptop:gap-y-[30px]">
        {sortedCategories.map(({ name, items }: Category, idx: number) => (
          <CatalogSlider key={idx} title={name} products={items} />
        ))}
      </ul>
    </section>
  );
}
