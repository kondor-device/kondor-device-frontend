"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { sendGTMEvent } from "@next/third-parties/google";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import Button from "@/components/shared/buttons/Button";
import CartPopUp from "../cart/CartPopUp";
import ImagePicker from "./ImagePicker";
import { useCartStore } from "@/store/cartStore";
import { useModalStore } from "@/store/modalStore";
import { ProductItem } from "@/types/productItem";
import { formatSum } from "@/utils/formatSum";
import { getBundleSavings } from "@/utils/bundlePricing";
import { buildBundleCartItem } from "@/utils/bundleCart";
import { getBundlePhotos } from "@/utils/bundlePhotos";

interface BundleProductCardProps {
  /** A category item with `kind: "bundle"` */
  product: ProductItem;
  categorySlug: string;
  shownOnAddonsProducts: ProductItem[];
}

// Bundle (set) slide of the home page catalog: same panel as ProductCard, but with the
// fixed content of the set instead of the color picker.
export default function BundleProductCard({
  product,
  categorySlug,
  shownOnAddonsProducts,
}: BundleProductCardProps) {
  const t = useTranslations();
  const { addToCart } = useCartStore();
  const openModal = useModalStore((state) => state.openModal);

  const {
    id,
    name,
    nameUk,
    slug,
    price,
    priceDiscount,
    bundleComponents,
    bundlePhotos,
    outOfStock,
  } = product;
  const components = bundleComponents ?? [];
  const bundlePrice = priceDiscount ?? price;
  const { savingsPercent } = getBundleSavings(price, bundlePrice);

  const href = `/catalog/${categorySlug}/${slug}`;

  // The set's own photos first (the first one is the main photo), then the components' photos;
  // the thumbnails under the photo, as on the other cards
  const photos = getBundlePhotos(bundlePhotos, components);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const onAddToCart = () => {
    if (outOfStock) return;

    addToCart(
      buildBundleCartItem({
        id,
        name,
        nameUk,
        bundlePrice,
        components,
        photos: bundlePhotos,
        label: t("bundle.label"),
      }),
    );
    openModal(
      "cartPopUp",
      <CartPopUp shownOnAddonsProducts={shownOnAddonsProducts} />,
      "desk:max-w-[950px] desk:w-[950px] deskxl:max-w-[1681px] deskxl:w-[1681px]",
    );
    sendGTMEvent({
      event: "add_to_cart",
      value: bundlePrice,
      currency: "UAH",
      items: [
        {
          item_id: id,
          item_name: `Сет ${nameUk ?? name}`.trim(),
          price: bundlePrice,
          quantity: 1,
        },
      ],
    });
  };

  return (
    <div
      className="relative flex flex-col gap-y-[15px] tabxl:flex-row tabxl:items-center tabxl:gap-x-8 min-h-full h-auto px-3 pt-3 pb-8 tabxl:p-8 deskxl:p-[35px] 
    rounded-[8px] tabxl:rounded-[30px] bg-panel"
    >
      <ImagePicker
        photos={photos}
        selectedPhotoIndex={selectedPhotoIndex}
        setSelectedPhotoIndex={setSelectedPhotoIndex}
        productUrl={href}
        badge={
          savingsPercent > 0
            ? { text: `${t("bundle.economy")} ${savingsPercent}%` }
            : undefined
        }
      />
      <div className="flex flex-col gap-y-[5px] tabxl:gap-y-[15px]">
        <Link href={href} className="group">
          <h3 className="mb-[5px] tabxl:mb-[10px] text-18bold tabxl:text-32bold deskxl:text-36med laptop:group-hover:brightness-125 focus-visible:brightness-125 active:brightness-125 active:scale-95 transition duration-300 ease-in-out">
            <p className="text-white line-clamp-1">{t("bundle.label")}&nbsp;</p>
            <p className="flex gap-x-4 items-center text-yellow line-clamp-2">
              <span>{name}</span>
              <Image
                src="/images/icons/link.svg"
                alt="link icon"
                width={32}
                height={32}
                className="inline-block size-[14px] tabxl:size-8"
              />
            </p>
          </h3>
        </Link>
        <ul className="flex flex-col gap-y-1 pl-4 tabxl:pl-5 list-disc marker:text-yellow text-10med tabxl:text-16med text-white">
          {components.map((component) => (
            <li key={`${component.itemId}-${component.code}`}>
              {component.generalname} {component.name}
              {component.colorOpt?.color
                ? `, ${component.colorOpt.color.toLowerCase()}`
                : ""}
            </li>
          ))}
        </ul>
        <div className="flex items-end gap-x-[10px] tabxl:gap-x-[25px] mb-[10px] tabxl:mb-[15px]">
          <p className="text-lg font-medium leading-[16px] tabxl:text-45bold deskxl:text-54bold text-white uppercase">
            {formatSum(bundlePrice)}
            {t("homePage.catalog.hrn")}
          </p>
          {savingsPercent > 0 ? (
            <div className="flex tabxl:flex-col-reverse items-end tabxl:items-start tabxl:justify-center gap-x-[5px]">
              <p className="text-sm font-bold leading-none tabxl:text-22bold text-grey uppercase line-through">
                {formatSum(price)}
                {t("homePage.catalog.hrn")}
              </p>
              <p className="text-[10px] font-medium leading-[11px] tabxl:text-16med text-yellow">
                {t("bundle.economy")} {savingsPercent}%
              </p>
            </div>
          ) : null}
        </div>
        <Button
          onClick={onAddToCart}
          disabled={outOfStock}
          className="w-full tabxl:w-[350px] deskxl:w-[437px] max-w-[327px] tabxl:max-w-[350px] deskxl:max-w-[437px] h-9"
        >
          {outOfStock ? t("buttons.outOfStock") : t("buttons.makeOrder")}
        </Button>
      </div>
    </div>
  );
}
