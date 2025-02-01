import { ProductItem } from "@/types/productItem";
import Image from "next/image";
import React from "react";

interface HeroProductCardProps {
  product: ProductItem;
}

export default function HeroProductCard({ product }: HeroProductCardProps) {
  const { name, priceDiscount, photos } = product;
  return <li><Image >
    <h3></h3>
    </li>;
}
