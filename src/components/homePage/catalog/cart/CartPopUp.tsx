"use client";

import React from "react";
import Modal from "@/components/shared/modal/Modal";
import CartItemsList from "./cartProducts/CartItemsList";
import { ProductItem } from "@/types/productItem";
import AddonsProductsList from "./addonProducts/AddonsProductsList";
import Button from "@/components/shared/buttons/Button";
import { useTranslations } from "next-intl";
import { usePopUpStore } from "@/store/popUpStore";
import Backdrop from "@/components/shared/backdrop/Backdrop";

interface CartPopUpProps {
  shownOnAddonsProducts: ProductItem[];
}

export default function CartPopUp({ shownOnAddonsProducts }: CartPopUpProps) {
  const t = useTranslations("buttons");

  const { setIsCartPopUpShown, setIsCheckoutPopUpShown, isCartPopUpShown } =
    usePopUpStore();

  const onCheckoutClick = () => {
    setIsCartPopUpShown(false);
    setIsCheckoutPopUpShown(true);
  };

  return (
    <>
      <Modal
        isPopUpShown={isCartPopUpShown}
        setIsPopUpShown={setIsCartPopUpShown}
        className="laptop:max-w-[1100px] laptop:w-[1100px] deskxl:max-w-[1681px] deskxl:w-[1681px]"
      >
        <div className="flex flex-col gap-y-[30px] laptop:flex-row laptop:justify-between">
          <CartItemsList />
          <AddonsProductsList shownOnAddonsProducts={shownOnAddonsProducts} />
        </div>
        <div className="flex flex-col laptop:flex-row-reverse laptop:justify-between gap-y-5 w-fit laptop:w-full mx-auto mt-[30px] laptop:mt-12 deskxl:mt-[60px]">
          <Button
            onClick={onCheckoutClick}
            className="w-full max-w-[350px] laptop:max-w-[330px] deskxl:max-w-[437px] max-h-[64px] deskxl:max-h-[85px]"
          >
            {t("next")}
          </Button>
          <Button
            onClick={() => setIsCartPopUpShown(false)}
            variant="secondary"
            className="w-full max-w-[350px] laptop:max-w-[330px] deskxl:max-w-[437px] max-h-[64px] deskxl:max-h-[85px]"
          >
            {t("continueShopping")}
          </Button>
        </div>
      </Modal>
      <Backdrop
        isVisible={isCartPopUpShown}
        onClick={() => {
          setIsCartPopUpShown(false);
        }}
      />
    </>
  );
}
