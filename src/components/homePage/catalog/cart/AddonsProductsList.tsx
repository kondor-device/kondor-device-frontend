import { ProductItem } from "@/types/productItem";
import React from "react";
import AddonItem from "./AddonItem";
import { useTranslations } from "next-intl";
import AddonsSliderMob from "./AddonsSliderMob";

interface AddonsProductsListProps {
  shownOnAddons: ProductItem[];
}

export default function AddonsProductsList({
  shownOnAddons,
}: AddonsProductsListProps) {
  const t = useTranslations();
  console.log(shownOnAddons);

  return (
    <div className="overflow-hidden">
      <h3 className="text-14bold mb-5">{t("homePage.catalog.alsoChoose")}</h3>
      <AddonsSliderMob addonsProducts={shownOnAddons} />
      <ul className="hidden laptop:flex flex-col gap-y-3 max-h-[150px] pr-[15px]">
        {shownOnAddons.map((addonItem) => (
          <AddonItem key={addonItem.id} addonItem={addonItem} />
        ))}
      </ul>
    </div>
  );
}
