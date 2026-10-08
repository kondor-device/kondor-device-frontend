import React from "react";
import { ProductItem } from "@/types/productItem";
import HeroProductCard from "./HeroProductCard";

interface HeroProductsProps {
  shownOnMainProducts: ProductItem[];
}

const MAX_PRODUCTS = 6;

export default async function HeroProducts({
  shownOnMainProducts,
}: HeroProductsProps) {
  if (!shownOnMainProducts) {
    return null;
  }

  const heroProducts = shownOnMainProducts.slice(0, MAX_PRODUCTS);

  // Mobile: a row that scrolls sideways and bleeds to the screen edges. The vertical
  // padding keeps the card shadows from being clipped by the scroll container
  return (
    <ul className="flex gap-5 sm:gap-3 tabxl:gap-4 laptop:gap-6 -mx-5 md:-mx-8 laptop:mx-0 px-5 md:px-8 laptop:px-0 py-4 -my-4 overflow-x-auto laptop:overflow-visible scroll-pl-5 md:scroll-pl-8 laptop:scroll-pl-0 snap-x snap-mandatory laptop:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {heroProducts.map((product: ProductItem, index: number) => (
        <HeroProductCard key={product.id} product={product} index={index} />
      ))}
    </ul>
  );
}
