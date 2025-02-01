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

  console.log(res.data?.allItems);

  //   const heroProducts = res.data?.allCategories
  //     .flatMap((category: CategoryItem) => category.items)
  //     .filter((product: ProductItem) => product.showonmain === true);

  return (
    <ul>
      {/* {heroProducts.map((product: ProductItem) => (
        <HeroProductCard key={idx} product={product} />
      ))} */}
    </ul>
  );
}
