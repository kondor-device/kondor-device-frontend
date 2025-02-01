import { ProductItem } from "@/types/productItem";
import React from "react";

interface HeroProductCard {
  product: ProductItem;
}

export default function HeroProductCard({ product }: HeroProductCardProps) {
  console.log(product);
  return <li>HeroProductCard</li>;
}
