"use client";

import { ProductItem } from "@/types/productItem";
import ImagePicker from "./ImagePicker";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import ColorPicker from "./ColorPicker";
import CardTitle from "./CardTitle";
import Characteristics from "./characteristics/Characteristics";
import Complectation from "./complectation/Complectation";
import { useCartStore } from "@/store/cartStore";
import Button from "@/components/shared/buttons/Button";
import { v4 as uuidv4 } from "uuid";
import { useModalStore } from "@/store/modalStore";
import SecondaryButton from "@/components/shared/buttons/SecondaryButton";
import CartPopUp from "../cart/CartPopUp";
import { sendGTMEvent } from "@next/third-parties/google";
import { formatSum } from "@/utils/formatSum";
import { Link } from "@/i18n/routing";

interface ProductCardProps {
  product: ProductItem;
  shownOnAddonsProducts: ProductItem[];
}

export default function ProductCard({
  product,
  shownOnAddonsProducts,
}: ProductCardProps) {
  const t = useTranslations();
  const { addToCart } = useCartStore();
  const openModal = useModalStore((state) => state.openModal);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const {
    id,
    generalname,
    name,
    slug,
    price,
    priceDiscount,
    coloropts,
    chars,
    complect,
    preorder,
    preordertext,
  } = product;

  const { photos } = coloropts[selectedColorIndex];

  const savings = (((price - (priceDiscount ?? price)) / price) * 100).toFixed(
    0
  );

  const actualPrice =
    !!priceDiscount && priceDiscount < price ? priceDiscount : price;

  const onAddToCart = () => {
    addToCart({
      id,
      uniqueId: uuidv4(),
      preorder,
      preordertext,
      generalName: generalname,
      name,
      priceDiscount,
      price,
      actualPrice,
      image: coloropts[selectedColorIndex]?.photos[0],
      color: coloropts[selectedColorIndex]?.color,
      code: coloropts[selectedColorIndex]?.code,
      quantity: 1,
    });
    openModal(
      "cartPopUp",
      <CartPopUp shownOnAddonsProducts={shownOnAddonsProducts} />,
      "desk:max-w-[950px] desk:w-[950px] deskxl:max-w-[1681px] deskxl:w-[1681px]"
    );
    sendGTMEvent({ event: "add_to_cart" });
  };

  return (
    <div
      className="relative flex flex-col gap-y-[15px] tabxl:flex-row tabxl:items-center tabxl:gap-x-8 min-h-full h-auto px-3 pt-3 pb-8 tabxl:p-8 deskxl:p-[35px] 
    rounded-[8px] tabxl:rounded-[30px] bg-dark"
    >
      <ImagePicker
        photos={photos}
        selectedPhotoIndex={selectedPhotoIndex}
        setSelectedPhotoIndex={setSelectedPhotoIndex}
        productUrl={`/catalog/${slug}?color=${coloropts[
            selectedColorIndex
          ]?.color.toLowerCase()}`}
      />
      <div className="flex flex-col gap-y-[5px] tabxl:gap-y-[15px]">
        <Link
          href={`/catalog/${slug}?color=${coloropts[
            selectedColorIndex
          ]?.color.toLowerCase()}`}
        >
          <CardTitle generalname={generalname} name={name} />
        </Link>
        {coloropts.length > 0 ? (
          <ColorPicker
            coloropts={coloropts}
            selectedColorIndex={selectedColorIndex}
            setSelectedColorIndex={setSelectedColorIndex}
          />
        ) : null}
        <div className="flex items-end gap-x-[10px] tabxl:gap-x-[25px] mb-[10px] tabxl:mb-[15px]">
          <p className="text-lg font-medium leading-[16px] tabxl:text-45bold deskxl:text-54bold text-white uppercase">
            {!!priceDiscount && priceDiscount < price
              ? formatSum(priceDiscount)
              : formatSum(price)}
            {t("homePage.catalog.hrn")}
          </p>
          {!!priceDiscount && priceDiscount < price ? (
            <div className="flex tabxl:flex-col-reverse items-end tabxl:items-start tabxl:justify-center gap-x-[5px]">
              <p className="text-sm font-bold leading-none tabxl:text-22bold text-grey uppercase line-through">
                {formatSum(price)}
                {t("homePage.catalog.hrn")}
              </p>
              <p className="text-[10px] font-medium leading-[11px] tabxl:text-16med text-yellow">
                {t("homePage.catalog.economy")}
                {savings}%
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex gap-x-[5px] tabxl:gap-x-5 mb-[10px] tabxl:mb-[5px]">
          <SecondaryButton
            onClick={() =>
              openModal(
                "characteristicsPopUp",
                <Characteristics characteristics={chars} />
              )
            }
          >
            {t("homePage.catalog.characteristics")}
          </SecondaryButton>
          <SecondaryButton
            onClick={() =>
              openModal(
                "complectationPopUp",
                <Complectation complectation={complect} />
              )
            }
          >
            {t("homePage.catalog.set")}
          </SecondaryButton>
        </div>
        <Button
          onClick={onAddToCart}
          className="w-full tabxl:w-[350px] deskxl:w-[437px] max-w-[327px] tabxl:max-w-[350px] deskxl:max-w-[437px] h-9"
        >
          {preorder ? t("buttons.preOrder") : t("buttons.makeOrder")}
        </Button>
        {preorder && preordertext ? (
          <p className="absolute bottom-3 tabxl:bottom-4 px-4 deskxl:px-6 text-10med tabxl:text-14med text-white">
            {preordertext}
          </p>
        ) : null}
      </div>
    </div>
  );
}
