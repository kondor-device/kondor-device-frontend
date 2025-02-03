import React from "react";
import { ProductItem } from "@/types/productItem";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Counter from "../Counter";

interface AddonItemDeskProps {
  addonItem: ProductItem;
}

export default function AddonItemDesk({ addonItem }: AddonItemDeskProps) {
  const t = useTranslations();

  const { name, generalname, coloropts, priceDiscount, price } = addonItem;

  return (
    <li className="flex items-end">
      <div className="laptop:size-[64px] deskxl:size-[85px] p-[8px] deskxl:p-[18px] rounded-[15px] shadow-card my-auto">
        <Image
          src={coloropts[0]?.photos[0]?.url}
          alt={coloropts[0]?.photos[0]?.alt || "keyboard"}
          width={1080}
          height={1080}
          className="w-full h-auto"
        />
      </div>
      <div className="flex flex-col justify-between mx-5">
        <h4 className="text-14bold deskxl:text-20bold">
          <p>{generalname}</p>
          <p className="text-yellow">{name}</p>
        </h4>
        <p className="mt-[10px] laptop:mt-[5px] deskxl:mt-[10px] laptop:text-14med deskxl:text-20med">
          {t("homePage.catalog.color")}
          <span>{coloropts[0]?.color}</span>
        </p>
      </div>
      <div className="flex flex-col mr-auto">
        <p className="w-fit laptop:mb-[10px] laptop:text-14med deskxl:text-20med">
          {priceDiscount}
          {t("homePage.catalog.hrn")}
        </p>
        <p className="w-fit laptop:text-12med deskxl:text-16med text-grey line-through uppercase">
          {price}
          {t("homePage.catalog.hrn")}
        </p>
      </div>
      <Counter />
    </li>
  );
}
