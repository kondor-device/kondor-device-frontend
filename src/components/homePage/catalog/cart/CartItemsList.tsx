import React from "react";
import { useCartStore } from "@/store/cartStore";
import CartProductItem from "./CartItem";
import { useTranslations } from "next-intl";

export default function CartItemsList() {
  const t = useTranslations();
  const { cartItems } = useCartStore();

  console.log(cartItems);

  return (
    <div className="pt-5 pb-10 px-[15px] rounded-[20px] bg-dark">
      <h3 className="mb-5 text-14med text-white">
        {t("homePage.catalog.yourOrder", { qty: cartItems.length })}
      </h3>
      <ul
        className="flex flex-col gap-y-3 max-h-[150px] overflow-y-auto scrollbar 
      scrollbar-w-[3px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-yellow 
      scrollbar-track-transparent"
      >
        {cartItems.map((cartItem) => (
          <CartProductItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
    </div>
  );
}
