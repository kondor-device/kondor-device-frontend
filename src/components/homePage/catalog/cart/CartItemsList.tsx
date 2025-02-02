import React from "react";
import { useCartStore } from "@/store/cartStore";
import CartProductItem from "./CartItem";
import { useTranslations } from "next-intl";

export default function CartItemsList() {
  const t = useTranslations();
  const { cartItems } = useCartStore();
  const totalAmount = useCartStore((state) => state.getTotalAmount());

  console.log(cartItems);

  return (
    <div className="pt-5 pb-10 pl-[15px] rounded-[20px] bg-dark">
      <h3 className="mb-5 pr-[15px] text-14med text-white">
        {t("homePage.catalog.yourOrder", { qty: cartItems.length })}
      </h3>
      <ul
        className="flex flex-col gap-y-3 max-h-[150px] pr-[15px] overflow-y-auto scrollbar 
      scrollbar-w-[2px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-yellow 
      scrollbar-track-transparent"
      >
        {cartItems.map((cartItem) => (
          <CartProductItem key={cartItem.uniqueId} cartItem={cartItem} />
        ))}
      </ul>
      <div className="flex justify-between mt-[15px] pt-3 pr-[15px] border-t border-white border-opacity-80 text-white">
        <p className="text-12med">{t("homePage.catalog.totalSum")}</p>
        <p className="text-14semi uppercase">
          {totalAmount}
          {t("homePage.catalog.hrn")}
        </p>
      </div>
    </div>
  );
}
