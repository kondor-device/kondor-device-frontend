import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ProductItem } from "@/types/productItem";
import Counter from "./Counter";
import { v4 as uuidv4 } from "uuid";
import { formatSum } from "@/utils/formatSum";

interface AddonItemMobProps {
  addonItem: ProductItem;
  className?: string;
}

export default function AddonItemMob({
  addonItem,
  className = "",
}: AddonItemMobProps) {
  const t = useTranslations();

  const {
    id,
    name,
    generalname,
    coloropts,
    priceDiscount,
    price,
    preorder,
    preordertext,
  } = addonItem;

  const actualPrice =
    !!priceDiscount && priceDiscount < price ? priceDiscount : price;

  const cartItem = {
    id,
    uniqueId: uuidv4(),
    preorder,
    preordertext,
    generalName: generalname,
    name,
    priceDiscount,
    price,
    actualPrice,
    image: coloropts[0]?.photos[0],
    color: coloropts[0]?.color,
    code: coloropts[0]?.code,
    quantity: 1,
  };

  return (
    <li
      className={`flex flex-col gap-y-[10px] p-2 rounded-[10px] ${className}`}
    >
      <div className="flex flex-col items-center gap-y-2 justify-between w-full aspect-[1/1] px-5 tab:px-6 py-[10px] rounded-[20px] bg-white shadow-card">
        <Image
          src={coloropts[0]?.photos[0]?.url || "/images/icons/logoSmall.svg"}
          alt={coloropts[0]?.photos[0]?.alt || "keyboard"}
          width={1080}
          height={1080}
          className="w-full h-auto"
        />
        <Counter cartItem={cartItem} className="max-w-[160px]" />
      </div>
      <div className="flex flex-col justify-between mr-auto">
        <h4 className="text-10bold mob:text-12bold tab:text-14bold desk:text-18bold">
          <p>{generalname}</p>
          <p className="text-yellow min-h-[30px]">{name}</p>
        </h4>
        <p className="mt-[5px] text-10med desk:text-12med">
          {t("homePage.catalog.color")}
          <span>{coloropts[0]?.color}</span>
        </p>
      </div>
      <div className="flex items-end">
        <p className="w-fit text-10med mob:text-12med desk:text-18med">
          {actualPrice}
          {t("homePage.catalog.hrn")}
        </p>
        {!!priceDiscount && priceDiscount < price ? (
          <p className="w-fit ml-[5px] text-10med desk:text-12med text-grey line-through uppercase">
            {formatSum(price)}
            {t("homePage.catalog.hrn")}
          </p>
        ) : null}
      </div>
    </li>
  );
}
