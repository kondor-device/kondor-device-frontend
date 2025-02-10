"use client";
import IconClose from "@/components/shared/icons/IconCLose";
import IconMinus from "@/components/shared/icons/IconMinus";
import { CartItem } from "@/types/cartItem";
import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

interface CounterProps {
  cartItem: CartItem;
}

export default function Counter({ cartItem }: CounterProps) {
  const { addToCart, removeFromCart, cartItems } = useCartStore();
  const getItemCount = (items: CartItem[], itemId: string): number => {
    return items.filter((item) => item.id === itemId).length;
  };

  useEffect(() => {
    setCount(getItemCount(cartItems, cartItem.id));
  }, [cartItems, cartItem.id]);
  const [count, setCount] = useState(0);

  const onMinusClick = () => {
    removeFromCart(cartItem.id);
    setCount(count - 1);
  };

  const onPlusClick = () => {
    addToCart(cartItem);
    setCount(count + 1);
  };

  return (
    <div className="flex items-center justify-between laptop:w-[94px] deskxl:w-[164px]">
      <button
        className="flex items-center justify-center size-5 tab:size-[28px] laptop:size-8 deskxl:size-[50px] p-1 laptop:p-2 rounded-[4px] deskxl:rounded-[11px] bg-yellow text-15med 
        deskxl:text-20med text-white disabled:bg-lightGrey enabled:active:scale-95 transition duration-300 ease-out"
        onClick={onMinusClick}
        disabled={count === 0}
        aria-label="minus"
      >
        <IconMinus className="w-full h-auto" />
      </button>
      <span className="text-14med deskxl:text-20med">{count}</span>
      <button
        className="flex items-center justify-center size-5 tab:size-[28px] laptop:size-8 deskxl:size-[50px] p-1 laptop:p-2 rounded-[4px] deskxl:rounded-[11px] bg-yellow text-15med deskxl:text-20med 
        text-white  disabled:bg-lightGrey enabled:active:scale-95 transition duration-300 ease-out"
        onClick={onPlusClick}
        aria-label="plus"
      >
        <IconClose className="w-full h-auto" />
      </button>
    </div>
  );
}
