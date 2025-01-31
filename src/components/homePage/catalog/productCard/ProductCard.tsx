"use client";
import Button from "@/components/shared/buttons/Button";
import { ProductItem } from "@/types/productItem";
import ImagePicker from "./ImagePicker";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import SecondaryButton from "@/components/shared/buttons/SecondaryButton";
import ColorPicker from "./ColorPicker";
import CardTitle from "./CardTitle";

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const { generalname, name, price, priceDiscount, coloropts } = product;

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const { photos } = coloropts[selectedColorIndex];

  const savings = (((price - priceDiscount) / price) * 100).toFixed(0);

  return (
    <div
      className="flex flex-col gap-y-[15px] laptop:flex-row laptop:items-center laptop:gap-x-10 deskxl:gap-x-[60px] min-h-full h-auto p-3 laptop:p-8 deskxl:p-[45px] 
    rounded-[8px] laptop:rounded-[30px] bg-black"
    >
      <ImagePicker
        photos={photos}
        selectedPhotoIndex={selectedPhotoIndex}
        setSelectedPhotoIndex={setSelectedPhotoIndex}
      />
      <div className="flex flex-col gap-y-[5px] laptop:gap-y-[15px]">
        <CardTitle generalname={generalname} name={name} />
        <ColorPicker
          coloropts={coloropts}
          selectedColorIndex={selectedColorIndex}
          setSelectedColorIndex={setSelectedColorIndex}
        />
        <div className="flex items-end gap-x-[10px] laptop:gap-x-[25px] mb-[10px] laptop:mb-[15px]">
          <p className="text-lg font-medium leading-none laptop:text-45bold deskxl:text-54bold text-white uppercase">
            {priceDiscount}
            {t("homePage.catalog.hrn")}
          </p>
          <div className="flex laptop:flex-col-reverse items-end laptop:items-start laptop:justify-center gap-x-[5px] h-[22px] laptop:h-[63px]">
            <p className="text-sm font-bold leading-none laptop:text-22bold text-grey uppercase line-through">
              {price}
              {t("homePage.catalog.hrn")}
            </p>
            <p className="text-[10px] font-medium leading-none laptop:text-16med text-yellow">
              {t("homePage.catalog.economy")}
              {savings}%
            </p>
          </div>
        </div>
        <div className="flex gap-x-[5px] laptop:gap-x-5 mb-[10px] laptop:mb-[5px]">
          <SecondaryButton>
            {t("homePage.catalog.characteristics")}
          </SecondaryButton>
          <SecondaryButton>{t("homePage.catalog.set")}</SecondaryButton>
        </div>
        <Button className="w-full laptop:w-[350px] deskxl:w-[437px] max-w-[327px] laptop:max-w-[350px] deskxl:max-w-[437px] h-9">
          {t("buttons.makeOrder")}
        </Button>
      </div>
    </div>
  );
}
