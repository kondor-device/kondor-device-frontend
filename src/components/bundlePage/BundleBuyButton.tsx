"use client";

import { useTranslations } from "next-intl";
import { sendGTMEvent } from "@next/third-parties/google";
import Button from "@/components/shared/buttons/Button";
import CartPopUp from "@/components/homePage/catalog/cart/CartPopUp";
import { useCartStore } from "@/store/cartStore";
import { useModalStore } from "@/store/modalStore";
import { Bundle } from "@/types/bundle";
import { ProductItem } from "@/types/productItem";
import { buildBundleCartItem } from "@/utils/bundleCart";

interface BundleBuyButtonProps {
  bundle: Bundle;
  addons: ProductItem[];
}

// "Buy" button of a set page: the button under the price (all screens) + the fixed bar on mobile
// (as on the product page). The set goes into the cart as one line with its fixed content.
export default function BundleBuyButton({
  bundle,
  addons,
}: BundleBuyButtonProps) {
  const t = useTranslations();

  const { addToCart } = useCartStore();
  const openModal = useModalStore((state) => state.openModal);

  const outOfStock = Boolean(bundle.outOfStock);
  const buttonText = outOfStock
    ? t("buttons.outOfStock")
    : t("buttons.makeOrder");

  const onAddToCart = () => {
    if (outOfStock) return;

    addToCart(
      buildBundleCartItem({
        id: bundle.id,
        name: bundle.name,
        nameUk: bundle.nameUk,
        bundlePrice: bundle.bundlePrice,
        components: bundle.components,
        photos: bundle.photos,
        label: t("bundle.label"),
      }),
    );

    openModal(
      "cartPopUp",
      <CartPopUp shownOnAddonsProducts={addons} />,
      "desk:max-w-[950px] desk:w-[950px] deskxl:max-w-[1681px] deskxl:w-[1681px]",
    );

    sendGTMEvent({
      event: "add_to_cart",
      value: bundle.bundlePrice,
      currency: "UAH",
      items: [
        {
          item_id: bundle.id,
          item_name: `Сет ${bundle.nameUk ?? bundle.name}`.trim(),
          price: bundle.bundlePrice,
          quantity: 1,
        },
      ],
    });
  };

  return (
    <>
      <Button
        onClick={onAddToCart}
        disabled={outOfStock}
        className="block mt-5 desk:mt-9 w-full max-w-[437px]"
      >
        {buttonText}
      </Button>
      <div className="fixed tabxl:hidden z-50 left-0 bottom-0 flex items-center justify-center w-full min-h-[88px] px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] rounded-t-[12px] bg-surface shadow-catalogCard">
        <Button
          onClick={onAddToCart}
          disabled={outOfStock}
          className="w-full max-w-[437px]"
        >
          {buttonText}
        </Button>
      </div>
    </>
  );
}
