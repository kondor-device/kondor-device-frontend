"use client";
import { useState, useEffect } from "react";
import { ProductItem } from "@/types/productItem";
import Image from "next/image";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { useModalStore } from "@/store/modalStore";
import Characteristics from "../homePage/catalog/productCard/characteristics/Characteristics";
import Complectation from "../homePage/catalog/productCard/complectation/Complectation";
import { formatSum } from "@/utils/formatSum";
import CartPopUp from "../homePage/catalog/cart/CartPopUp";
import { sendGTMEvent } from "@next/third-parties/google";
import CatalogCardButton from "../shared/buttons/CatalogCardButton";
import ColorPicker from "./ColorPicker";

interface CatalogCardProps {
  product: ProductItem;
  shownOnAddons: ProductItem[];
  className?: string;
}

export default function CatalogCard({
  product,
  shownOnAddons,
  className = "",
}: CatalogCardProps) {
  const t = useTranslations();
  const { addToCart } = useCartStore();
  const openModal = useModalStore((state) => state.openModal);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  const {
    id,
    generalname,
    name,
    slug,
    price,
    priceDiscount,
    chars,
    complect,
    preorder,
    preordertext,
    coloropts,
  } = product;

  const savings = (((price - (priceDiscount ?? price)) / price) * 100).toFixed(
    0
  );

  const actualPrice =
    !!priceDiscount && priceDiscount < price ? priceDiscount : price;

  const onAddToCart = () => {
    addToCart({
      id,
      uniqueId: uuidv4(),
      preorder,
      preordertext,
      generalName: generalname,
      name,
      priceDiscount,
      price,
      actualPrice,
      image: coloropts[selectedColorIndex]?.photos[0],
      color: coloropts[selectedColorIndex]?.color,
      code: coloropts[selectedColorIndex]?.code,
      quantity: 1,
    });
    openModal(
      "cartPopUp",
      <CartPopUp shownOnAddonsProducts={shownOnAddons} />,
      "desk:max-w-[950px] desk:w-[950px] deskxl:max-w-[1681px] deskxl:w-[1681px]"
    );
    sendGTMEvent({ event: "add_to_cart" });
  };

  useEffect(() => {
    const updateWindowWidth = () => {
      const width = window.innerWidth;

      if (width < 1550) {
        setIsDesktop(false);
      } else {
        setIsDesktop(true);
      }
    };

    updateWindowWidth();

    window.addEventListener("resize", updateWindowWidth);
    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);

  return (
    <div
      className={`flex flex-col justify-between p-3 desk:p-4 rounded-[8px] desk:rounded-[20px] shadow-catalogCard bg-white min-h-full ${className}`}
    >
      <div className="rounded-[12px] aspect-square w-full mb-2 desk:mb-3">
        <Link href={`/catalog/${slug}`}>
          {" "}
          <Image
            src={
              coloropts[selectedColorIndex].photos[0]?.url ||
              "/images/icons/logoSmall.svg"
            }
            alt={coloropts[selectedColorIndex].photos[0]?.alt || "keyboard"}
            width={1080}
            height={1080}
            className="max-w-full max-h-full object-cover laptop:hover:scale-105 transition duration-1000 ease-in-out"
          />
        </Link>
      </div>
      <Link href={`/catalog/${slug}`} className="group block mb-3 desk:mb-4">
        <h3 className="flex flex-wrap gap-x-2 items-center text-10bold laptop:text-14bold desk:text-18bold laptop:group-hover:brightness-125 focus-visible:brightness-125 active:brightness-125 active:scale-95 transition duration-300 ease-in-out">
          <span>{generalname}</span>
          <span className="text-yellow">{name}</span>

          <Image
            src="/images/icons/link.svg"
            alt="link icon"
            width={32}
            height={32}
            className="size-[9px] desk:size-[15px]"
          />
        </h3>
      </Link>

      <div>
        {" "}
        {coloropts.length > 0 ? (
          <ColorPicker
            coloropts={coloropts}
            selectedColorIndex={selectedColorIndex}
            setSelectedColorIndex={setSelectedColorIndex}
          />
        ) : null}
        <div className="flex flex-col desk:flex-row desk:items-end gap-y-1 gap-x-[10px] mb-3 desk:mb-4">
          <p className="text-[18px] desk:text-[24px] font-bold uppercase leading-[105%]">
            {!!priceDiscount && priceDiscount < price
              ? formatSum(priceDiscount)
              : formatSum(price)}
            {t("homePage.catalog.hrn")}
          </p>
          {!!priceDiscount && priceDiscount < price ? (
            <div className="flex items-end gap-x-[5px]">
              <p className="text-14bold desk:text-18bold text-grey uppercase line-through leading-[128%]">
                {formatSum(price)}
                {t("homePage.catalog.hrn")}
              </p>
              <p className="text-[8px] desk:text-[12px] font-medium desk:leading-[20px] text-yellow">
                {t("homePage.catalog.economy")}
                {savings}%
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col desk:flex-row gap-[5px] mb-3 desk:mb-4">
          <CatalogCardButton
            onClick={() =>
              openModal(
                "characteristicsPopUp",
                <Characteristics characteristics={chars} />
              )
            }
          >
            {t("homePage.catalog.characteristics")}
          </CatalogCardButton>
          <CatalogCardButton
            onClick={() =>
              openModal(
                "complectationPopUp",
                <Complectation complectation={complect} />
              )
            }
          >
            {isDesktop
              ? t("homePage.catalog.set")
              : t("homePage.catalog.setMobile")}
          </CatalogCardButton>
        </div>
        <button
          type="button"
          onClick={onAddToCart}
          className={`flex items-center justify-center w-full h-[33px] desk:h-9 px-3 text-9bold desk:text-12bold rounded-full transition duration-300 ease-out enabled:active:scale-95 
            outline-none enabled:bg-yellowGradient enabled:active:brightness-[115%] desk:enabled:hover:brightness-[115%] 
            enabled:focus-visible:brightness-[115%]            `}
        >
          {preorder ? t("buttons.preOrder") : t("buttons.makeOrder")}
        </button>
        {preorder && preordertext ? (
          <p className="absolute bottom-3 tabxl:bottom-4 px-4 deskxl:px-6 text-10med tabxl:text-14med text-white">
            {preordertext}
          </p>
        ) : null}
      </div>
    </div>
  );
}
