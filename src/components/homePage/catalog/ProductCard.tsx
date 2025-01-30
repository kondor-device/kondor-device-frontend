import { ProductItem } from "@/types/productItem";
import React from "react";

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  console.log(product);

  return (
    <div className="aspect-[350/447] tabxl:aspect-[1252/539] mx-[5px] tab:mx-3 laptop:mx-8 rounded-[8px] bg-black">
      ProductCard
    </div>
  );
}
