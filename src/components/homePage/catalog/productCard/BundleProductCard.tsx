"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { sendGTMEvent } from "@next/third-parties/google";
import { Link } from "@/i18n/routing";
import Button from "@/components/shared/buttons/Button";
import CartPopUp from "../cart/CartPopUp";
import { useCartStore } from "@/store/cartStore";
import { useModalStore } from "@/store/modalStore";
import { ProductItem } from "@/types/productItem";
import { formatSum } from "@/utils/formatSum";
import { getBundleSavings } from "@/utils/bundlePricing";
import { buildBundleCartItem } from "@/utils/bundleCart";

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
  } = product;
  // The set's own photo (added in the admin) goes first; without it the card shows the components
  const coverPhoto = bundlePhotos?.[0];
  const components = bundleComponents ?? [];
  const bundlePrice = priceDiscount ?? price;
  const { savingsPercent } = getBundleSavings(price, bundlePrice);

  const href = `/catalog/${categorySlug}/${slug}`;

  const onAddToCart = () => {
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
      <div
        className="relative flex justify-between items-center w-full max-w-[306px] tabxl:max-w-[340px] tabxl:size-[340px] deskxl:max-w-[466px] deskxl:size-[466px] bg-white 
  aspect-[1/1] rounded-[11px] tabxl:rounded-[40px] overflow-hidden"
      >
        {savingsPercent > 0 ? (
          <div className="absolute z-10 top-1.5 tabxl:top-[14px] left-1.5 tabxl:left-[14px] shrink-0 w-fit py-[7px] px-2.5 tabxl:px-[14px] rounded-full border bg-white border-black text-black text-[10px] tabxl:text-[12px] font-semibold leading-[115%]">
            {t("bundle.economy")} {savingsPercent}%
          </div>
        ) : null}
        <Link
          href={href}
          className="flex items-center justify-center gap-2 size-full p-4 tabxl:p-8"
        >
          {coverPhoto ? (
            <Image
              src={coverPhoto.url}
              alt={coverPhoto.alt || name}
              width={1080}
              height={1080}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            components.map((component) => {
              const photo = component.colorOpt?.photos?.[0];

              return (
                <Image
                  key={`${component.itemId}-${component.code}`}
                  src={photo?.url || "/images/icons/logoSmall.svg"}
                  alt={
                    photo?.alt || `${component.generalname} ${component.name}`
                  }
                  width={1080}
                  height={1080}
                  className="min-w-0 flex-1 basis-0 max-h-full object-contain"
                />
              );
            })
          )}
        </Link>
      </div>
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
        <ul className="flex flex-col gap-y-1 text-10med tabxl:text-16med text-white">
          {components.map((component) => (
            <li key={`${component.itemId}-${component.code}`}>
              {component.generalname} {component.name}
              {component.colorOpt?.color ? `, ${component.colorOpt.color}` : ""}
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
          className="w-full tabxl:w-[350px] deskxl:w-[437px] max-w-[327px] tabxl:max-w-[350px] deskxl:max-w-[437px] h-9"
        >
          {t("buttons.makeOrder")}
        </Button>
      </div>
    </div>
  );
}
