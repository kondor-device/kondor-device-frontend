"use client";

import React from "react";
import CartItemsList from "./cartProducts/CartItemsList";
import { ProductItem } from "@/types/productItem";
import AddonsProductsList from "./addonProducts/AddonsProductsList";
import Button from "@/components/shared/buttons/Button";
import { useTranslations } from "next-intl";
import { useModalStore } from "@/store/modalStore";
import CheckoutPopUp from "../checkout/CheckoutPopUp";
import { sendGTMEvent } from "@next/third-parties/google";
import { useCartStore } from "@/store/cartStore";

interface CartPopUpProps {
  shownOnAddonsProducts: ProductItem[];
}

export default function CartPopUp({ shownOnAddonsProducts }: CartPopUpProps) {
  const t = useTranslations("buttons");

  const openModal = useModalStore((state) => state.openModal);
  const { closeModal } = useModalStore();
  const { activeModal } = useModalStore((state) => state);
  const { cartItems, getTotalAmount } = useCartStore();

  if (activeModal.name !== "cartPopUp") {
    return null;
  }

  const onCheckoutClick = () => {
    closeModal();
    openModal(
      "checkoutPopUp",
      <CheckoutPopUp />,
      "laptop:max-w-[1100px] laptop:w-[1100px] deskxl:max-w-[1681px] deskxl:w-[1681px]"
    );
    const modalContainer = document.getElementById("modal");
    if (modalContainer) {
      modalContainer.scrollTop = 0;
    }
    // value/currency/items потрібні для InitiateCheckout в Meta Pixel/CAPI
    // (тег в GTM читає ці поля з dataLayer) — раніше подія йшла зовсім без
    // них, тому Meta бачив 100% InitiateCheckout без ціни.
    sendGTMEvent({
      event: "start_checkout",
      value: getTotalAmount(),
      currency: "UAH",
      items: cartItems.map((item) => ({
        item_id: item.code || item.id,
        item_name: `${item.generalName} ${item.name}`.trim(),
        item_variant: item.color,
        price: item.actualPrice,
        quantity: item.quantity,
      })),
    });
  };

  return (
    <div className={activeModal.name === "cartPopUp" ? "block" : "hidden"}>
      <div className="flex flex-col gap-y-[30px] laptop:flex-row laptop:justify-between">
        <CartItemsList />
        <AddonsProductsList shownOnAddonsProducts={shownOnAddonsProducts} />
      </div>
      <div className="flex flex-col laptop:flex-row-reverse items-center laptop:justify-between gap-y-5 w-full mt-[30px] laptop:mt-12 deskxl:mt-[60px]">
        <Button
          onClick={onCheckoutClick}
          className="w-full max-w-[350px] laptop:max-w-[330px] deskxl:max-w-[437px] max-h-[64px] deskxl:max-h-[85px]"
        >
          {t("next")}
        </Button>
        <Button
          onClick={() => closeModal()}
          variant="secondary"
          className="w-full max-w-[350px] laptop:max-w-[330px] deskxl:max-w-[437px] max-h-[64px] deskxl:max-h-[85px]"
        >
          {t("continueShopping")}
        </Button>
      </div>
    </div>
  );
}
