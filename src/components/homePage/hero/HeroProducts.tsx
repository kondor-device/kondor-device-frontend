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
    <ul>
      {heroProducts.map((product: ProductItem) => (
        <HeroProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
}
