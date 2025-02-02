import React from "react";
import { getProducts } from "@/utils/getProducts";
import { ProductItem } from "@/types/productItem";
import HeroProductCard from "./HeroProductCard";
import { SHOWN_ON_MAIN_PRODUCTS } from "@/lib/datoCmsQueries";

export default async function HeroProducts() {
  const res = await getProducts(SHOWN_ON_MAIN_PRODUCTS);

  console.log(res);

  if (!res.data?.allItems) {
    return null;
  }
  const heroProducts =
    res.data?.allItems?.length > 4
      ? res.data.allItems.slice(0, 4)
      : res.data?.allItems;

  console.log(heroProducts);

  return (
    <ul className="flex flex-wrap justify-between gap-y-[14px] laptop:gap-[16px] deskxl:gap-6 laptop:w-[49%] desk:w-[42%] deskxl:w-[54.5%] max-w-[704px] laptop:max-w-full my-[30px] laptop:my-auto mx-auto deskxl:mr-0">
      {heroProducts.map((product: ProductItem) => (
        <HeroProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
}
