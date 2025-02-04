import React from "react";
import AddonItemDesk from "./AddonItemDesk";
import { ProductItem } from "@/types/productItem";

interface AddonsListDeskProps {
  shownOnAddonsProducts: ProductItem[];
}

export default function AddonsListDesk({
  shownOnAddonsProducts,
}: AddonsListDeskProps) {
  return (
    <ul
      className="hidden laptop:flex flex-col gap-y-4 deskxl:gap-y-[37px] laptop:max-h-[296px] deskxl:max-h-[362px] py-1 pl-1 pr-2 overflow-y-auto scrollbar 
      scrollbar-w-[2px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-yellow 
      scrollbar-track-transparent"
    >
      {shownOnAddonsProducts.map((addonItem) => (
        <AddonItemDesk key={addonItem.id} addonItem={addonItem} />
      ))}
    </ul>
  );
}
