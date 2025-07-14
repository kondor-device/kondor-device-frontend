"use client";
import { useState } from "react";
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
}

export default function CatalogCard({
  product,
  shownOnAddons,
}: CatalogCardProps) {
  const t = useTranslations();
  const { addToCart } = useCartStore();
  const openModal = useModalStore((state) => state.openModal);

  const { activeModal } = useModalStore();

  console.log(shownOnAddons);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

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
      "laptop:max-w-[1100px] laptop:w-[1100px] deskxl:max-w-[1681px] deskxl:w-[1681px]"
    );
    sendGTMEvent({ event: "add_to_cart" });
  };

  console.log(product);

  return (
    <div className="w-[calc(33.33%-16px)] p-4 rounded-[20px] shadow-catalogCard bg-white">
      <div className="rounded-[12px] aspect-square w-full mb-3">
        <Image
          src={
            coloropts[selectedColorIndex].photos[0]?.url ||
            "/images/icons/logoSmall.svg"
          }
          alt={coloropts[selectedColorIndex].photos[0]?.alt || "keyboard"}
          width={1080}
          height={1080}
          className="max-w-full max-h-full object-cover"
        />
      </div>
      <Link href={`/catalog/${slug}`}>
        <h3 className="flex flex-wrap items-center mb-4 text-18bold">
          <span>{generalname}</span> <span className="text-yellow">{name}</span>
          &nbsp;&nbsp;
          <Image
            src="/images/icons/link.svg"
            alt="link icon"
            width={32}
            height={32}
            className="inline-block size-[15px]"
          />
        </h3>
      </Link>

      {coloropts.length > 0 ? (
        <ColorPicker
          coloropts={coloropts}
          selectedColorIndex={selectedColorIndex}
          setSelectedColorIndex={setSelectedColorIndex}
        />
      ) : null}

      <div className="flex items-end gap-x-[10px] mb-4">
        <p className="text-24bold uppercase leading-[105%]">
          {!!priceDiscount && priceDiscount < price
            ? formatSum(priceDiscount)
            : formatSum(price)}
          {t("homePage.catalog.hrn")}
        </p>
        {!!priceDiscount && priceDiscount < price ? (
          <div className="flex items-end gap-x-[5px]">
            <p className="text-18bold text-grey uppercase line-through leading-[128%]">
              {formatSum(price)}
              {t("homePage.catalog.hrn")}
            </p>
            <p className="text-12med text-yellow leading-[160%]">
              {t("homePage.catalog.economy")}
              {savings}%
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex gap-x-[5px] mb-4">
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
          {t("homePage.catalog.set")}
        </CatalogCardButton>
      </div>
      <button
        type="button"
        onClick={onAddToCart}
        className={`flex items-center justify-center w-full h-9 px-8 text-12bold rounded-full transition duration-300 ease-out enabled:active:scale-95 
            outline-none enabled:bg-yellowGradient enabled:active:brightness-[115%] laptop:enabled:hover:brightness-[115%] 
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
  );
}
