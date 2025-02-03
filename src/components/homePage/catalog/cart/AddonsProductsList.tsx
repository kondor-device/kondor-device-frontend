import { ProductItem } from "@/types/productItem";
import React from "react";

interface AddonsProductsListProps {
  shownOnAddons: ProductItem[];
}

export default function AddonsProductsList({
  shownOnAddons,
}: AddonsProductsListProps) {
  console.log(shownOnAddons);

  return <div>AddonsPropductsList</div>;
}
