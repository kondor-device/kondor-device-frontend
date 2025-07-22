"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ProductItem } from "@/types/productItem";
import ImagePicker from "./ImagePicker";
import ColorPicker from "./ColorPicker";
import Characteristics from "./Characteristics";
import Complect from "./Complect";
import { useTranslations } from "next-intl";
import Navigation from "./Navigation";
import { formatSum } from "@/utils/formatSum";
import Button from "@/components/shared/buttons/Button";
import { useCartStore } from "@/store/cartStore";
import { useModalStore } from "@/store/modalStore";
import CartPopUp from "@/components/homePage/catalog/cart/CartPopUp";
import { sendGTMEvent } from "@next/third-parties/google";
import Video from "./Video";
import AnimationWrapper from "@/components/homePage/hero/AnimationWrapper";

interface ProductInfoProps {
  product: ProductItem;
  addons: ProductItem[];
}

const SECTION_ID = "product-page-info";

const PRICE_ID = "product-page-price";

const DESCRIPTION_ID = "description";

export default function ProductInfo({ product, addons }: ProductInfoProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const t = useTranslations();

  const { addToCart } = useCartStore();
  const openModal = useModalStore((state) => state.openModal);

  const {
    id,
    video,
    description,
    chars,
    complect,
    coloropts,
    generalname,
    name,
    price,
    priceDiscount,
    preorder,
    preordertext,
  } = product;

  const { photos } = coloropts[selectedColorIndex];

  const savings = (((price - (priceDiscount ?? price)) / price) * 100).toFixed(
    0
  );

  const html = description
    // 1. Списки: перетворюємо рядки, що починаються з "* ", на <li>...</li>
    .replace(/(?:^|\n)\* (.+)/g, "<li>$1</li>")
    // 2. Обгортаємо всі <li> в один <ul> — якщо є, додаємо перенос перед списком
    .replace(/((?:<li>.*?<\/li>\n?)+)/g, "\n<ul class='list-disc pl-6'>$1</ul>")
    // 2.5 Видаляємо переноси після </ul>, щоб не було зайвих <br> після списку
    .replace(/<\/ul>\n+/g, "</ul>")
    // 3. Всі залишкові перенос рядків → <br>
    .replace(/\n/g, "<br>");

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
      <CartPopUp shownOnAddonsProducts={addons} />,
      "desk:max-w-[950px] desk:w-[950px] deskxl:max-w-[1681px] deskxl:w-[1681px]"
    );
    sendGTMEvent({ event: "add_to_cart" });
  };

  return (
    <>
      <section className="container max-w-[1920px] mb-8 desk:mb-[69px]">
        <Navigation product={product} />

        <div className="tabxl:flex gap-x-[80px] desk:gap-x-[120px] w-full mb-5 tab:mb-[100px]">
          <ImagePicker
            photos={photos}
            selectedPhotoIndex={selectedPhotoIndex}
            setSelectedPhotoIndex={setSelectedPhotoIndex}
          />
          <div id={SECTION_ID} className="w-fit">
            <AnimationWrapper
              sectionId={SECTION_ID}
              commonStyles={`transition duration-700 ease-slow `}
              visibleStyles="opacity-100 translate-x-0"
              unVisibleStyles="opacity-0 translate-x-[50px]"
            >
              <h1 className="flex flex-wrap items-center mb-5 desk:mb-9 text-[24px] font-medium leading-[110%] desk:text-[45px]">
                <span>{generalname}</span>&nbsp;&nbsp;
                <span className="text-yellow">{name}</span>
              </h1>
            </AnimationWrapper>
            {coloropts?.length > 0 ? (
              <ColorPicker
                coloropts={coloropts}
                selectedColorIndex={selectedColorIndex}
                setSelectedColorIndex={setSelectedColorIndex}
              />
            ) : null}
            <AnimationWrapper
              sectionId={PRICE_ID}
              commonStyles={`flex flex-row items-end gap-x-6 mb-5 desk:mb-9 transition duration-700 ease-slow `}
              visibleStyles="opacity-100 translate-y-0 delay-[800ms]"
              unVisibleStyles="opacity-0 translate-y-[50px]"
            >
              <p
                id={PRICE_ID}
                className="text-[40px] desk:text-[54px] font-bold uppercase leading-none"
              >
                {!!priceDiscount && priceDiscount < price
                  ? formatSum(priceDiscount)
                  : formatSum(price)}
                {t("homePage.catalog.hrn")}
              </p>
              {!!priceDiscount && priceDiscount < price ? (
                <div className="flex flex-col-reverse items-end justify-center gap-x-[5px]">
                  <p className="text-[16px] desk:text-[22px] text-grey uppercase line-through font-bold leading-[150%]">
                    {formatSum(price)}
                    {t("homePage.catalog.hrn")}
                  </p>
                  <p className="text-[12px] desk:text-[16px] font-medium desk:leading-[20px] text-yellow">
                    {t("homePage.catalog.economy")}
                    {savings}%
                  </p>
                </div>
              ) : null}
            </AnimationWrapper>
            <AnimationWrapper
              sectionId={PRICE_ID}
              commonStyles={`flex flex-row items-end gap-x-6 mb-5 desk:mb-9 transition duration-1000 ease-slow`}
              visibleStyles="opacity-100 translate-y-0 scale-[100%] delay-[1000ms]"
              unVisibleStyles="opacity-0 translate-y-0 scale-[70%]"
            >
              {" "}
              <Button
                onClick={onAddToCart}
                className="hidden tab:block w-full tab:w-[350px] desk:w-[437px] max-w-[327px] laptop:max-w-[350px] desk:max-w-[437px]"
              >
                {preorder ? t("buttons.preOrder") : t("buttons.makeOrder")}
              </Button>
            </AnimationWrapper>
            {preorder && preordertext ? (
              <p className="absolute bottom-3 tabxl:bottom-4 px-4 deskxl:px-6 text-10med tabxl:text-14med text-white">
                {preordertext}
              </p>
            ) : null}
          </div>
        </div>

        <div className="tabxl:flex gap-x-8">
          <div className="tabxl:w-[calc(50%-16px)]">
            {description ? (
              <div
                id={DESCRIPTION_ID}
                className="mb-4 tab:mb-8 p-5 desk:py-[56px] desk:px-[76px] scroll-mt-[82px] tabxl:scroll-mt-[113px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard"
              >
                <AnimationWrapper
                  sectionId={DESCRIPTION_ID}
                  commonStyles={`transition duration-700 ease-slow`}
                  visibleStyles="opacity-100 translate-x-0"
                  unVisibleStyles="opacity-0 -translate-x-[50px]"
                >
                  {" "}
                  <h3 className="mb-5 text-14bold desk:text-24bold">
                    {t("productPage.description")}
                  </h3>
                </AnimationWrapper>

                <div
                  className="text-12med desk:text-18med"
                  dangerouslySetInnerHTML={{ __html: html }}
                ></div>
              </div>
            ) : null}
            <Video video={video} className="hidden tabxl:block" />
          </div>
          <div className="tabxl:w-[calc(50%-16px)]">
            {chars?.length > 0 ? (
              <Characteristics characteristics={chars} />
            ) : null}
            <Video video={video} className="tabxl:hidden" />
            {complect ? <Complect complectation={complect} /> : null}
          </div>
        </div>
      </section>
      <div className="fixed tab:hidden z-50 left-0 bottom-0 flex items-center justify-center w-dvw h-[88px] px-5 py-4 rounded-t-[12px] bg-white shadow-catalogCard">
        <Button onClick={onAddToCart} className="w-full max-w-[437px]">
          {preorder ? t("buttons.preOrder") : t("buttons.makeOrder")}
        </Button>
        {preorder && preordertext ? (
          <p className="absolute bottom-3 tabxl:bottom-4 px-4 deskxl:px-6 text-10med tabxl:text-14med text-white">
            {preordertext}
          </p>
        ) : null}
      </div>
    </>
  );
}
