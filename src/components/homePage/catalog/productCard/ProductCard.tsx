"use client";

import { ProductItem } from "@/types/productItem";
import ImagePicker from "./ImagePicker";
import React, { useState, Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import ColorPicker from "./ColorPicker";
import CardTitle from "./CardTitle";
import Characteristics from "./characteristics/Characteristics";
import Complectation from "./complectation/Complectation";
import { useCartStore } from "@/store/cartStore";
import Cart from "../cart/Cart";
import { v4 as uuidv4 } from "uuid";

interface ProductCardProps {
  product: ProductItem;
  shownOnAddonsProducts: ProductItem[];
  isCharacteristicsPopUpShown: boolean;
  setIsCharacteristicsPopUpShown: Dispatch<SetStateAction<boolean>>;
  isComplectationPopUpShown: boolean;
  setIsComplectationPopUpShown: Dispatch<SetStateAction<boolean>>;
  isCartPopUpShown: boolean;
  setIsCartPopUpShown: Dispatch<SetStateAction<boolean>>;
  isCheckoutPopUpShown: boolean;
  setIsCheckoutPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function ProductCard({
  product,
  shownOnAddonsProducts,
  isCharacteristicsPopUpShown,
  setIsCharacteristicsPopUpShown,
  isComplectationPopUpShown,
  setIsComplectationPopUpShown,
  isCartPopUpShown,
  setIsCartPopUpShown,
  isCheckoutPopUpShown,
  setIsCheckoutPopUpShown,
}: ProductCardProps) {
  const t = useTranslations();

  const { addToCart } = useCartStore();

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
    setIsCartPopUpShown(true);
  };

  return (
    <div
      className="flex flex-col gap-y-[15px] laptop:flex-row laptop:items-center laptop:gap-x-10 min-h-full h-auto p-3 laptop:p-8 deskxl:p-[35px] 
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
          <Characteristics
            isPopUpShown={isCharacteristicsPopUpShown}
            setIsPopUpShown={setIsCharacteristicsPopUpShown}
            characteristics={chars}
          />
          <Complectation
            isPopUpShown={isComplectationPopUpShown}
            setIsPopUpShown={setIsComplectationPopUpShown}
            complectation={complect}
          />
        </div>
        <Cart
          onPlaceOrder={onAddToCart}
          isPopUpShown={isCartPopUpShown}
          setIsPopUpShown={setIsCartPopUpShown}
          isCheckoutPopUpShown={isCheckoutPopUpShown}
          setIsCheckoutPopUpShown={setIsCheckoutPopUpShown}
          shownOnAddonsProducts={shownOnAddonsProducts}
        />
      </div>
    </div>
  );
}
