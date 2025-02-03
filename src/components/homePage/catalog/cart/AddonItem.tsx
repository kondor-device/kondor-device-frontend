import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ProductItem } from "@/types/productItem";

interface CartItemProps {
  addonItem: ProductItem;
}

export default function AddonItem({ addonItem }: CartItemProps) {
  const t = useTranslations();

  const { name, generalname, coloropts, priceDiscount, price } = addonItem;

  return (
    <li className="w-[153px]">
      <div className="size-12 p-[10px] rounded-[8px]">
        <Image
          src={coloropts[0]?.photos[0]?.url}
          alt={coloropts[0]?.photos[0]?.alt || "keyboard"}
          width={1080}
          height={1080}
          className="w-full h-auto"
        />
      </div>
      <div className="flex flex-col justify-between mr-auto">
        <h4 className="text-10bold mob:text-12bold">
          <p>{generalname}</p>
          <p className="text-yellow">{name}</p>
        </h4>
        <p className="text-10med">
          {t("homePage.catalog.color")}
          <span>{coloropts[0]?.color}</span>
        </p>
      </div>
      <div className="flex">
        <div>
          <p className="w-fit ml-auto text-10med mob:text-12med">
            {priceDiscount}
            {t("homePage.catalog.hrn")}
          </p>
          <p className="w-fit ml-auto text-10med text-grey line-through uppercase">
            {price}
            {t("homePage.catalog.hrn")}
          </p>
        </div>
      </div>
    </li>
  );
}
