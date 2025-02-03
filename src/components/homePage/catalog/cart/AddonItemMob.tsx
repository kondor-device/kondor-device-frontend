import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ProductItem } from "@/types/productItem";
import Counter from "./Counter";

interface CartItemProps {
  addonItem: ProductItem;
}

export default function AddonItemMob({ addonItem }: CartItemProps) {
  const t = useTranslations();

  const { name, generalname, coloropts, priceDiscount, price } = addonItem;

  return (
    <li className="flex flex-col gap-y-[10px] max-w-[203px] tab:max-w-[219px] bg-dark p-2 rounded-[10px]">
      <div className="w-full px-5 tab:px-6 py-[10px] rounded-[20px] bg-white">
        <Image
          src={coloropts[0]?.photos[0]?.url}
          alt={coloropts[0]?.photos[0]?.alt || "keyboard"}
          width={1080}
          height={1080}
          className="w-full h-auto"
        />
        <Counter />
      </div>
      <div className="flex flex-col justify-between mr-auto">
        <h4 className="text-10bold mob:text-12bold">
          <p className="text-white">{generalname}</p>
          <p className="text-yellow">{name}</p>
        </h4>
        <p className="mt-[5px] text-10med text-white">
          {t("homePage.catalog.color")}
          <span>{coloropts[0]?.color}</span>
        </p>
      </div>
      <div className="flex items-end">
        <p className="w-fit text-10med mob:text-12med text-white">
          {priceDiscount}
          {t("homePage.catalog.hrn")}
        </p>
        <p className="w-fit ml-[5px] text-10med text-grey line-through uppercase">
          {price}
          {t("homePage.catalog.hrn")}
        </p>
      </div>
    </li>
  );
}
