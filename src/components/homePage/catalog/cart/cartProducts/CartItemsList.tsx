"use client";
import React from "react";
import { useCartStore } from "@/store/cartStore";
import CartProductItem from "./CartItem";
import { useTranslations } from "next-intl";

export default function CartItemsList() {
  const t = useTranslations();
  const { cartItems } = useCartStore();
  const totalAmount = useCartStore((state) => state.getTotalAmount());

  return (
    <div className="laptop:w-[40%] py-5 deskxl:py-10 pl-[15px] deskxl:pl-[30px] mt-4 tab:mt-8 laptop:mt-0 rounded-[20px] bg-dark">
      <h3 className="mb-5 deskxl:mb-10 pr-[15px] text-14med laptop:text-16med deskxl:text-24med text-white">
        {t("homePage.catalog.yourOrder", { qty: cartItems.length })}
      </h3>
      {cartItems.length > 0 ? (
        <ul
          className="flex flex-col gap-y-3 deskxl:gap-y-[25px] h-[150px] laptop:h-[225px] deskxl:h-[265px] pr-[15px] deskxl:pr-[30px] overflow-y-auto scrollbar 
      scrollbar-w-[2px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-yellow 
      scrollbar-track-transparent"
        >
          {cartItems.map((cartItem) => (
            <CartProductItem key={cartItem.uniqueId} cartItem={cartItem} />
          ))}
        </ul>
      ) : (
        <div className="h-[150px] laptop:h-[225px] deskxl:h-[265px]"></div>
      )}
      <div className="flex justify-between mt-[15px] deskxl:mt-[30px] pt-3 deskxl:pt-[20px] pr-[15px] deskxl:pr-[30px] border-t border-white border-opacity-80 text-white">
        <p className="text-12med laptop:text-14med deskxl:text-24med">
          {t("homePage.catalog.totalSum")}
        </p>
        {/* {totalAmount !== null ? (
          <p className="text-14semi laptop:text-16semi deskxl:text-28semi uppercase">
            {totalAmount}
            {t("homePage.catalog.hrn")}
          </p>
        ) : null} */}
      </div>
    </div>
  );
}
