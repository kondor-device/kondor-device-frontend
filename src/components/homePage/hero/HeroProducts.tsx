import React from "react";
import { ProductItem } from "@/types/productItem";
import HeroProductCard from "./HeroProductCard";
import HeroProductsScroller from "./HeroProductsScroller";

interface HeroProductsProps {
  shownOnMainProducts: ProductItem[];
}

export default async function HeroProducts({
  shownOnMainProducts,
}: HeroProductsProps) {
  if (!shownOnMainProducts) {
    return null;
  }

  // Every product is shown: the row scrolls sideways at any width and bleeds to the screen
  // edges (the negative margins and padding repeat the container paddings; the vertical
  // padding keeps the card shadows from being clipped by the scroll container)
  return (
    <HeroProductsScroller className="flex gap-[10px] sm:gap-3 tabxl:gap-4 laptop:gap-6 -mx-5 md:-mx-8 xl:-mx-20 desk:-mx-[100px] deskxl:-mx-[240px] px-5 md:px-8 xl:px-20 desk:px-[100px] deskxl:px-[240px] py-4 -my-4 overflow-x-auto scroll-pl-5 md:scroll-pl-8 xl:scroll-pl-20 desk:scroll-pl-[100px] deskxl:scroll-pl-[240px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {shownOnMainProducts.map((product: ProductItem, index: number) => (
        <HeroProductCard key={product.id} product={product} index={index} />
      ))}
    </HeroProductsScroller>
  );
}
