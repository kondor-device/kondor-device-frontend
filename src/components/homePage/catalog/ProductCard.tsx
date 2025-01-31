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
    <div className="mx-[5px] tab:mx-3 laptop:mx-8 rounded-[8px] laptop:rounded-[30px] bg-black">
      <Image
        src={photos[0]?.url}
        alt={photos[0]?.alt}
        width={0}
        height={0}
        className="rounded-[11px] laptop:rounded-[40px]"
      />
      <h3 className="text-12bold laptop:text-36med">
        <p className="text-white">{generalname}</p>
        <p className="text-yellow">{name}</p>
      </h3>
      <span className="size-[18px] laptop:size-[45px] rounded-full"></span>
      <span className="text-18med laptop:text-54bold text-white">
        {priceDiscount}
        {t("homePage.catalog.hrn")}
      </span>
      <span className="text-14bold laptop:text-22bold text-grey line-through">
        {price}
      </span>
      <span className="text-10med laptop:text-16med text-yellow">
        {savings}%
      </span>
      <SecondaryButton>{t("homePage.catalog.characteristics")}</SecondaryButton>
      <SecondaryButton>{t("homePage.catalog.set")}</SecondaryButton>
      <Button>{t("buttons.makeOrder")}</Button>
    </div>
  );
}
