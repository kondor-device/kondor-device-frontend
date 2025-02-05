import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import IconButton from "@/components/shared/buttons/IconButton";
import { useCartStore } from "@/store/cartStore";

interface CartButtonProps {
  setIsCartPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function CartButton({ setIsCartPopUpShown }: CartButtonProps) {
  const { cartItems } = useCartStore();

  return (
    <>
      {cartItems.length ? (
        <IconButton
          handleClick={() => setIsCartPopUpShown(true)}
          data-label={cartItems.length.toString()}
          className="block fixed z-[5] right-6 bottom-6 size-14 laptop:size-[70px]"
        >
          <>
            <span className="absolute top-[-10px] right-[-10px] size-[22px] text-12semi text-white flex items-center justify-center rounded-full bg-dark">
              {cartItems.length}
            </span>
            <Image
              src="/images/icons/cart.svg"
              alt="cart icon"
              width="71"
              height="71"
              className="w-full h-auto"
            />
          </>
        </IconButton>
      ) : null}
    </>
  );
}
