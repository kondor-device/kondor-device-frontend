import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ProductItem } from "@/types/productItem";
import Counter from "../Counter";
import { v4 as uuidv4 } from "uuid";

interface AddonItemMobProps {
  addonItem: ProductItem;
}

export default function AddonItemMob({ addonItem }: AddonItemMobProps) {
  const t = useTranslations();

  const { id, name, generalname, coloropts, priceDiscount, price } = addonItem;

  const cartItem = {
    id,
    uniqueId: uuidv4(),
    generalName: generalname,
    name,
    priceDiscount,
    price,
    image: coloropts[0]?.photos[0],
    color: coloropts[0]?.color,
    quantity: 1,
  };

  return (
    <li className="flex flex-col gap-y-[10px] max-w-[203px] tab:max-w-[219px] p-2 rounded-[10px]">
      <div className="flex flex-col justify-between w-full aspect-[1/1] px-5 tab:px-6 py-[10px] rounded-[20px] bg-white shadow-card">
        <Image
          src={coloropts[0]?.photos[0]?.url}
          alt={coloropts[0]?.photos[0]?.alt || "keyboard"}
          width={1080}
          height={1080}
          className="w-full h-auto"
        />
        <Counter cartItem={cartItem} />
      </div>
      <div className="flex flex-col justify-between mr-auto">
        <h4 className="text-10bold mob:text-12bold tab:text-14bold">
          <p>{generalname}</p>
          <p className="text-yellow min-h-[30px]">{name}</p>
        </h4>
        <p className="mt-[5px] text-10med">
          {t("homePage.catalog.color")}
          <span>{coloropts[0]?.color}</span>
        </p>
      </div>
      <div className="flex items-end">
        <p className="w-fit text-10med mob:text-12med">
          {priceDiscount || price}
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
