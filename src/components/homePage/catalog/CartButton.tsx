"use client";

import { usePathname } from "@/i18n/routing";
import Image from "next/image";
import IconButton from "@/components/shared/buttons/IconButton";
import { useCartStore } from "@/store/cartStore";
import { useModalStore } from "@/store/modalStore";
import CartPopUp from "./cart/CartPopUp";
import { ProductItem } from "@/types/productItem";

interface CartButtonProps {
  shownOnAddonsProducts: ProductItem[];
}

export default function CartButton({ shownOnAddonsProducts }: CartButtonProps) {
  const { cartItems } = useCartStore();
  const { openModal } = useModalStore();

  const pathname = usePathname();
  const isProductPage = /^\/catalog\/[^/]+$/.test(pathname);

  return (
    <>
      {cartItems.length > 0 ? (
        <IconButton
          handleClick={() =>
            openModal(
              "cartPopUp",
              <CartPopUp shownOnAddonsProducts={shownOnAddonsProducts} />,
              "laptop:max-w-[1100px] laptop:w-[1100px] deskxl:max-w-[1681px] deskxl:w-[1681px]"
            )
          }
          data-label={cartItems.length.toString()}
          className={`block fixed z-[5] right-6 size-14 laptop:size-[70px] bg-yellow rounded-[10px] shadow-cartButton ${
            isProductPage
              ? "bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] tabxl:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
              : "bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
          }`}
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
