import React from "react";
import { ProductItem } from "@/types/productItem";
import HeroProductCard from "./HeroProductCard";

interface HeroProductsProps {
  shownOnMainProducts: ProductItem[];
}

export default async function HeroProducts({
  shownOnMainProducts,
}: HeroProductsProps) {
  if (!shownOnMainProducts) {
    return null;
  }
  const heroProducts =
    shownOnMainProducts.length > 4
      ? shownOnMainProducts.slice(0, 4)
      : shownOnMainProducts;

  return (
    <ul className="flex flex-wrap justify-between gap-y-[14px] laptop:gap-[16px] deskxl:gap-6 laptop:w-[49%] desk:w-[42%] deskxl:w-[54.5%] max-w-[704px] laptop:max-w-full my-[30px] laptop:my-auto mx-auto deskxl:mr-0">
      {heroProducts.map((product: ProductItem) => (
        <HeroProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
}
