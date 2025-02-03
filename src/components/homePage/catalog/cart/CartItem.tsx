import { CartItem } from "@/types/cartItem";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import IconButton from "@/components/shared/buttons/IconButton";
import IconClose from "@/components/shared/icons/IconCLose";
import { useCartStore } from "@/store/cartStore";

interface CartItemProps {
  cartItem: CartItem;
}

export default function CartProductItem({ cartItem }: CartItemProps) {
  const t = useTranslations();

  const { removeSingleItem } = useCartStore();

  const { name, generalName, image, priceDiscount, price, color, uniqueId } =
    cartItem;

  return (
    <li className="flex gap-x-[10px] justify-between">
      <div className="size-12 p-[10px] rounded-[8px] bg-white">
        <Image
          src={image.url}
          alt={image.alt || "keyboard"}
          width={1080}
          height={1080}
          className="w-full h-auto"
        />
      </div>
      <div className="flex flex-col justify-between mr-auto">
        <h4 className="text-10med mob:text-12bold">
          <p className="text-white">{generalName}</p>
          <p className="text-yellow">{name}</p>
        </h4>
        <p className="text-10med text-white">
          {t("homePage.catalog.color")}
          <span>{color}</span>
        </p>
      </div>
      <div className="flex flex-col justify-between items-end">
        <IconButton
          handleClick={() => removeSingleItem(uniqueId)}
          className="w-fit h-fit"
        >
          <IconClose className="size-3 rotate-45 text-white" />
        </IconButton>
        <div>
          <p className="w-fit ml-auto text-10med mob:text-12med text-white">
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
