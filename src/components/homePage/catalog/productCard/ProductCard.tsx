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
    price,
    priceDiscount,
    coloropts,
    chars,
    complect,
  } = product;

  const { photos } = coloropts[selectedColorIndex];

  const savings = (((price - (priceDiscount ?? price)) / price) * 100).toFixed(
    0
  );

  const onAddToCart = () => {
    addToCart({
      id,
      uniqueId: uuidv4(),
      generalName: generalname,
      name,
      priceDiscount,
      price,
      image: coloropts[selectedColorIndex]?.photos[0],
      color: coloropts[selectedColorIndex]?.color,
      quantity: 1,
    });
    openModal(<CartPopUp shownOnAddonsProducts={shownOnAddonsProducts} />);
  };

  return (
    <div
      className="flex flex-col gap-y-[15px] laptop:flex-row laptop:items-center laptop:gap-x-8 min-h-full h-auto p-3 laptop:p-8 deskxl:p-[35px] 
    rounded-[8px] laptop:rounded-[30px] bg-dark"
    >
      <ImagePicker
        photos={photos}
        selectedPhotoIndex={selectedPhotoIndex}
        setSelectedPhotoIndex={setSelectedPhotoIndex}
      />
      <div className="flex flex-col gap-y-[5px] laptop:gap-y-[15px]">
        <CardTitle generalname={generalname} name={name} />
        {coloropts.length > 0 ? (
          <ColorPicker
            coloropts={coloropts}
            selectedColorIndex={selectedColorIndex}
            setSelectedColorIndex={setSelectedColorIndex}
          />
        ) : null}
        <div className="flex items-end gap-x-[10px] laptop:gap-x-[25px] mb-[10px] laptop:mb-[15px]">
          <p className="text-lg font-medium leading-none laptop:text-45bold deskxl:text-54bold text-white uppercase">
            {!!priceDiscount && priceDiscount < price ? priceDiscount : price}
            {t("homePage.catalog.hrn")}
          </p>
          {!!priceDiscount && priceDiscount < price ? (
            <div className="flex laptop:flex-col-reverse items-end laptop:items-start laptop:justify-center gap-x-[5px] h-[22px] laptop:h-[63px]">
              <p className="text-sm font-bold leading-none laptop:text-22bold text-grey uppercase line-through">
                {price}
                {t("homePage.catalog.hrn")}
              </p>
              <p className="text-[10px] font-medium leading-none laptop:text-16med text-yellow">
                {t("homePage.catalog.economy")}
                {savings}%
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex gap-x-[5px] laptop:gap-x-5 mb-[10px] laptop:mb-[5px]">
          <SecondaryButton
            onClick={() =>
              openModal(<Characteristics characteristics={chars} />)
            }
          >
            {t("homePage.catalog.characteristics")}
          </SecondaryButton>
          <SecondaryButton
            onClick={() =>
              openModal(<Complectation complectation={complect} />)
            }
          >
            {t("homePage.catalog.set")}
          </SecondaryButton>
        </div>
        <Button
          onClick={onAddToCart}
          className="w-full laptop:w-[350px] deskxl:w-[437px] max-w-[327px] laptop:max-w-[350px] deskxl:max-w-[437px] h-9"
        >
          {t("buttons.makeOrder")}
        </Button>
      </div>
    </div>
  );
}
