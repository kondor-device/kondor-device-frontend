import { ProductItem } from "@/types/productItem";
import React from "react";
import { useTranslations } from "next-intl";
import AddonsSliderMob from "./AddonsSliderMob";
import AddonsListDesk from "./AddonsListDesk";

interface AddonsProductsListProps {
  shownOnAddonsProducts: ProductItem[];
}

export default function AddonsProductsList({
  shownOnAddonsProducts,
}: AddonsProductsListProps) {
  const t = useTranslations();

  if (!shownOnAddonsProducts.length) {
    return null;
  }

  return (
    <>
      {shownOnAddonsProducts.length > 0 ? (
        <div className="laptop:w-[56%]">
          <h3 className="mb-5 laptop:mb-6 deskxl:mb-[36px] text-14bold laptop:text-22bold deskxl:text-24bold">
            {t("homePage.catalog.alsoChoose")}
          </h3>
          {/* <AddonsSliderMob shownOnAddonsProducts={shownOnAddonsProducts} /> */}
          <AddonsListDesk shownOnAddonsProducts={shownOnAddonsProducts} />
        </div>
      ) : null}
    </>
  );
}
