"use client";
import React, { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/shared/buttons/Button";
import CheckoutPopUp from "./CheckoutPopUp";

interface CheckoutProps {
  onCheckoutClick: () => void;
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function Checkout({
  onCheckoutClick,
  isPopUpShown,
  setIsPopUpShown,
}: CheckoutProps) {
  const t = useTranslations();

  return (
    <>
      <Button
        onClick={onCheckoutClick}
        className="w-full max-w-[350px] laptop:max-w-[330px] deskxl:max-w-[437px] max-h-[64px] deskxl:max-h-[85px]"
      >
        {t("buttons.next")}
      </Button>
      <CheckoutPopUp
        isPopUpShown={isPopUpShown}
        setIsPopUpShown={setIsPopUpShown}
      />
    </>
  );
}
