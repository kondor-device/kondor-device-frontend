"use client";
import { useState } from "react";
import { ProductItem } from "@/types/productItem";
import ImagePicker from "./ImagePicker";
import ColorPicker from "./ColorPicker";
import Characteristics from "./Characteristics";
import Complect from "./Complect";
import ReactPlayer from "react-player";
import { useTranslations } from "next-intl";
import Navigation from "./Navigation";
import { formatSum } from "@/utils/formatSum";
import Button from "@/components/shared/buttons/Button";

interface ProductInfoProps {
  product: ProductItem;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const t = useTranslations();

  const {
    video,
    description,
    chars,
    complect,
    coloropts,
    generalname,
    name,
    price,
    priceDiscount,
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

  return (
    <>
      <section className="container max-w-[1920px]">
        <Navigation product={product} />
        <div className="mb-5 tab:mb-[100px]">
          <ImagePicker
            photos={photos}
            selectedPhotoIndex={selectedPhotoIndex}
            setSelectedPhotoIndex={setSelectedPhotoIndex}
          />
          <div>
            <h1 className="flex flex-wrap items-center mb-5 desk:mb-9 text-24med desk:text-45med">
              <span>{generalname}</span>&nbsp;&nbsp;
              <span className="text-yellow">{name}</span>
            </h1>
            {coloropts?.length > 0 ? (
              <ColorPicker
                coloropts={coloropts}
                selectedColorIndex={selectedColorIndex}
                setSelectedColorIndex={setSelectedColorIndex}
              />
            ) : null}
            <div className="flex flex-row items-end gap-x-6 mb-5 desk:mb-9">
              <p className="text-[40px] desk:text-[54px] font-bold uppercase leading-none">
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
            </div>
            <Button className="hidden tab:block w-full tab:w-[350px] desk:w-[437px] max-w-[327px] laptop:max-w-[350px] desk:max-w-[437px]">
              {t("buttons.makeOrder")}
            </Button>
          </div>
        </div>
        {description ? (
          <div
            id="description"
            className="mb-4 tab:mb-8 p-5 desk:py-[56px] desk:px-[76px] scroll-mt-[82px] tabxl:scroll-mt-[113px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard"
          >
            <h3 className="mb-5 text-14bold desk:text-24bold">
              {t("productPage.description")}
            </h3>
            <div
              className="text-12med desk:text-18med"
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>
          </div>
        ) : null}
        {chars?.length > 0 ? <Characteristics characteristics={chars} /> : null}
        {video ? (
          <div
            id="video"
            className="mb-4 tab:mb-0 p-5 desk:py-[56px] desk:px-[76px] scroll-mt-[82px] tabxl:scroll-mt-[113px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard"
          >
            <h3 className="mb-5 text-14bold desk:text-24bold">
              {t("productPage.see")}
            </h3>
            <div className="rounded-[20px] overflow-hidden">
              <ReactPlayer
                src={video?.url}
                width="100%"
                height="auto"
                controls
              />
            </div>
          </div>
        ) : null}
        {complect ? <Complect complectation={complect} /> : null}
      </section>
      <div className="fixed tab:hidden z-50 left-0 bottom-0 flex items-center justify-center w-dvw h-[88px] px-5 py-4 rounded-t-[12px] bg-white shadow-catalogCard">
        <Button className="w-full max-w-[437px]">
          {t("buttons.makeOrder")}
        </Button>
      </div>
    </>
  );
}
