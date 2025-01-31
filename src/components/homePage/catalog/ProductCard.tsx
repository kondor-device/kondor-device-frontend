"use client";
import Button from "@/components/shared/buttons/Button";
import { ProductItem } from "@/types/productItem";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import SecondaryButton from "@/components/shared/buttons/SecondaryButton";

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const { generalname, name, price, priceDiscount, coloropts } = product;

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const { photos } = coloropts[selectedColorIndex];

  const savings = (((price - priceDiscount) / price) * 100).toFixed(0);

  return (
    <div className="flex flex-col gap-y-[15px] laptop:flex-row laptop:items-center laptop:gap-x-[60px] w-[330px] mob:w-[340px] min-h-full h-auto p-3 laptop:p-[45px] rounded-[8px] laptop:rounded-[30px] bg-black">
      <div className="h-[257px] laptop:w-[449px] laptop:h-[449px] mx-auto bg-white rounded-[11px] laptop:rounded-[40px]">
        <Image
          src={photos[0]?.url}
          alt={photos[0]?.alt || "keyboard"}
          width={1080}
          height={1080}
          className=""
        />
        {/* <ul className="flex flex-col gap-y-[10px] laptop:flex-row gap-x-8">
          {photos.map(({ url, alt }, idx) => (
            <li key={idx} className="size-12 laptop:size-[101px] bg-black">
              <Image
                src={url}
                alt={alt || "keyboard"}
                width={1080}
                height={1080}
                className=""
              />
            </li>
          ))}
        </ul> */}
      </div>
      <div className="flex flex-col gap-y-[5px] laptop:gap-y-[15px]">
        <h3 className="mb-[5px] laptop:mb-[10px] text-12bold laptop:text-36med">
          <p className="text-white">{generalname}&nbsp;</p>
          <p className="text-yellow">{name}</p>
        </h3>
        <ul className="flex gap-x-[10px] laptop:gap-x-5 mb-[5px] laptop:mb-[15px]">
          {coloropts.map(({ code, colorset }, index) => (
            <li
              key={code}
              className={`size-[18px] laptop:size-[45px] rounded-full cursor-pointer transition duration-300 ease-out ${
                selectedColorIndex === index
                  ? "shadow-colorPickerThin laptop:shadow-colorPicker"
                  : ""
              } ${colorset.hex === "000000" ? "border border-yellow" : ""}`}
              style={{ backgroundColor: colorset.hex }}
              onClick={() => setSelectedColorIndex(index)}
            ></li>
          ))}
        </ul>
        <div className="flex items-center gap-x-[10px] laptop:gap-x-[25px] mb-[10px] laptop:mb-[15px]">
          <p className="text-18med laptop:text-54bold text-white uppercase">
            {priceDiscount}
            {t("homePage.catalog.hrn")}
          </p>
          <div className="flex laptop:flex-col-reverse items-center laptop:items-start gap-x-[5px] h-[22px]">
            <p className="text-14bold laptop:text-22bold text-grey uppercase line-through">
              {price}
              {t("homePage.catalog.hrn")}
            </p>
            <p className="text-10med laptop:text-16med text-yellow">
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
        <Button className="w-full laptop:w-[437px] max-w-[327px] laptop:max-w-[437px] h-9">
          {t("buttons.makeOrder")}
        </Button>
      </div>
    </div>
  );
}
