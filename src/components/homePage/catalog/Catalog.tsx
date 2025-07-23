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
    <section id="catalog" className="pt-[60px] laptop:pt-[100px]">
      <ul className="flex flex-col gap-y-5 laptop:gap-y-[30px]">
        {sortedCategories.map(
          ({ name, id, slug, items }: Category, idx: number) => {
            // фільтрація продуктів, у яких showonmain === false
            const filteredItems = items.filter(
              (item) => item.showonmain === false
            );

            if (filteredItems.length === 0) return null;

            // якщо продуктів менше 5 — додаємо копії
            const paddedItems = [...filteredItems];
            while (paddedItems.length < 5) {
              paddedItems.push(
                filteredItems[paddedItems.length % filteredItems.length]
              );
            }

            return (
              <CatalogSlider
                key={idx}
                title={name}
                id={id}
                slug={slug}
                products={paddedItems}
                shownOnAddonsProducts={shownOnAddonsProducts}
              />
            );
          }
        )}
      </ul>
    </section>
  );
}
