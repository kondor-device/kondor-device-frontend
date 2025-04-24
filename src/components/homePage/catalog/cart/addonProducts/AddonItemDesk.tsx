import React from "react";
import { ProductItem } from "@/types/productItem";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Counter from "./Counter";
import { v4 as uuidv4 } from "uuid";
import { formatSum } from "@/utils/formatSum";

interface AddonItemDeskProps {
  addonItem: ProductItem;
}

export default function AddonItemDesk({ addonItem }: AddonItemDeskProps) {
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
    <li className="flex items-end">
      <div className="laptop:size-[64px] deskxl:size-[85px] p-[8px] deskxl:p-[18px] rounded-[15px] shadow-card my-auto">
        <Image
          src={coloropts[0]?.photos[0]?.url || "/images/icons/logoSmall.svg"}
          alt={coloropts[0]?.photos[0]?.alt || "keyboard"}
          width={1080}
          height={1080}
          className="w-full h-auto"
        />
      </div>
      <div className="flex flex-col justify-between w-[38%] mx-5">
        <h4 className="text-14bold deskxl:text-20bold">
          <p>{generalname}</p>
          <p className="text-yellow">{name}</p>
        </h4>
        <p className="mt-[10px] laptop:mt-[5px] deskxl:mt-[10px] laptop:text-14med deskxl:text-20med">
          {t("homePage.catalog.color")}
          <span>{coloropts[0]?.color}</span>
        </p>
      </div>
      <div className="flex flex-col laptop:selection:gap-y-[10px] mr-auto">
        <p className="w-fit laptop:text-14med deskxl:text-20med">
          {actualPrice}
          {t("homePage.catalog.hrn")}
        </p>
        {!!priceDiscount && priceDiscount < price ? (
          <p className="w-fit laptop:text-12med deskxl:text-16med text-grey line-through uppercase">
            {formatSum(price)}
            {t("homePage.catalog.hrn")}
          </p>
        ) : null}
      </div>
      <Counter cartItem={cartItem} />
    </li>
  );
}
