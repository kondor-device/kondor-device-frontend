import Button from "@/components/shared/buttons/Button";
import { ProductItem } from "@/types/productItem";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import SecondaryButton from "@/components/shared/buttons/SecondaryButton";

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const { generalname, name, price, priceDiscount, coloropts } = product;
  const { photos } = coloropts[0];

  const savings = (((price - priceDiscount) / price) * 100).toFixed(2);

  console.log(product);

  return (
    <div className="flex flex-col gap-y-[15px] laptop:flex-row laptop:items-center laptop:gap-x-[60px] p-3 laptop:p-[45px] mx-[5px] tab:mx-3 laptop:mx-8 rounded-[8px] laptop:rounded-[30px] bg-black">
      <div className="h-[257px] laptop:w-[449px] laptop:h-[449px] mx-auto bg-white rounded-[11px] laptop:rounded-[40px]">
        <Image
          src={photos[0]?.url}
          alt={photos[0]?.alt || "keyboard"}
          width={1080}
          height={1080}
          className=""
        />
      </div>
      <div className="flex flex-col gap-y-[5px] laptop:gap-y-[15px]">
        <h3 className="laptop:flex laptop:flex-col mb-[5px] laptop:mb-[10px] text-12bold laptop:text-36med">
          <span className="text-white">{generalname}</span>&nbsp;
          <span className="text-yellow">{name}</span>
        </h3>
        <div className="mb-[5px] laptop:mb-[15px]">
          <div className="size-[18px] laptop:size-[45px] rounded-full bg-yellow"></div>
        </div>
        <div className="flex items-center gap-x-[10px] laptop:gap-x-[25px] mb-[10px] laptop:mb-[15px]">
          <p className="text-18med laptop:text-54bold text-white uppercase">
            {priceDiscount}
            {t("homePage.catalog.hrn")}
          </p>
          <div className="flex laptop:flex-col-reverse items-center laptop:items-start gap-x-[5px]">
            <p className="text-14bold laptop:text-22bold text-grey uppercase line-through leading-none">
              {price}
              {t("homePage.catalog.hrn")}
            </p>
            <p className="leading-none text-10med laptop:text-16med text-yellow">
              {t("homePage.catalog.economy")}
              {savings}%
            </p>
          </div>
        </div>
        <div className="flex gap-x-[5px] laptop:gap-x-5 mb-[10px] laptop:mb-[5px]">
          <SecondaryButton>
            {t("homePage.catalog.characteristics")}
          </SecondaryButton>
          <SecondaryButton>{t("homePage.catalog.set")}</SecondaryButton>
        </div>
        <Button className="w-full laptop:w-[437px] max-w-[327px] laptop:max-w-[437px] h-9">
          {t("buttons.makeOrder")}
        </Button>
      </div>
    </div>
  );
}
