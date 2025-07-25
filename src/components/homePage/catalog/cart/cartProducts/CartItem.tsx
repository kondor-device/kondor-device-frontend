import { CartItem } from "@/types/cartItem";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import IconButton from "@/components/shared/buttons/IconButton";
import IconClose from "@/components/shared/icons/IconCLose";
import { useCartStore } from "@/store/cartStore";
import { formatSum } from "@/utils/formatSum";

interface CartItemProps {
  cartItem: CartItem;
}

export default function CartProductItem({ cartItem }: CartItemProps) {
  const t = useTranslations();

  const { removeSingleItem } = useCartStore();

  const {
    name,
    generalName,
    image,
    priceDiscount,
    price,
    color,
    uniqueId,
    actualPrice,
  } = cartItem;

  return (
    <li className="flex gap-x-[10px] deskxl:gap-x-[20px] justify-between">
      <div className="flex items-center justify-center size-12 laptop:size-14 deskxl:size-[85px] p-[10px] deskxl:p-[18px] my-auto rounded-[8px] deskxl:rounded-[15px] bg-white">
        <Image
          src={image.url || "/images/icons/logoSmall.svg"}
          alt={image.alt || "keyboard"}
          width={1080}
          height={1080}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="flex flex-col justify-between max-w-[45%] mob:max-w-[60%] laptop:max-w-[55%] mr-auto">
        <h4 className="mb-[5px] text-10med mob:text-12bold laptop:text-14bold deskxl:text-20bold">
          <p className="text-white">{generalName}</p>
          <p className="text-yellow">{name}</p>
        </h4>
        <p className="text-10med laptop:text-12med deskxl:text-20med text-white">
          {t("homePage.catalog.color")}
          <span>{color}</span>
        </p>
      </div>
      <div className="flex flex-col justify-between items-end">
        <IconButton
          handleClick={() => removeSingleItem(uniqueId)}
          className="w-fit h-fit text-white enabled:active:scale-95 enabled:active:text-yellow laptop:enabled:hover:text-yellow 
          enabled:focus-visible:text-yellow transition duration-300 ease-out"
        >
          <IconClose className="size-3 deskxl:size-5 rotate-45" />
        </IconButton>
        <div className="">
          <p className="w-fit ml-auto text-10med mob:text-12med deskxl:text-20med text-white">
            {formatSum(actualPrice)}
            {t("homePage.catalog.hrn")}
          </p>
          {!!priceDiscount && priceDiscount < price ? (
            <p className="w-fit ml-auto text-10med deskxl:text-16med text-grey line-through uppercase">
              {formatSum(price)}
              {t("homePage.catalog.hrn")}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}
