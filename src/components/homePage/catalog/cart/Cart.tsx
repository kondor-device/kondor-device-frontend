"use client";
import React, { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import CartPopUp from "./CartPopUp";
import Button from "@/components/shared/buttons/Button";
import { ProductItem } from "@/types/productItem";

interface CartProps {
  shownOnAddonsProducts: ProductItem[];
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  onPlaceOrder: () => void;
}

export default function Cart({
  shownOnAddonsProducts,
  isPopUpShown,
  setIsPopUpShown,
  onPlaceOrder,
}: CartProps) {
  const t = useTranslations();

  return (
    <>
      <Button
        onClick={onPlaceOrder}
        className="w-full laptop:w-[350px] deskxl:w-[437px] max-w-[327px] laptop:max-w-[350px] deskxl:max-w-[437px] h-9"
      >
        {t("buttons.makeOrder")}
      </Button>
      <CartPopUp
        isPopUpShown={isPopUpShown}
        setIsPopUpShown={setIsPopUpShown}
        shownOnAddonsProducts={shownOnAddonsProducts}
      />
    </>
  );
}
