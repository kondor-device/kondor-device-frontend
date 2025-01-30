import Button from "@/components/shared/buttons/Button";
import { ProductItem } from "@/types/productItem";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const { generalname, name, price, priceDiscount, coloropts } = product;
  console.log(product);

  return (
    <div className="mx-[5px] tab:mx-3 laptop:mx-8 rounded-[8px] laptop:rounded-[30px] bg-black">
      <Image
        src={coloropts[0].photos[0]}
        alt={name}
        width={}
        height={}
        className="rounded-[11px] laptop:rounded-[40px]"
      />
      <h3 className="text-12bold laptop:text-36med">
        <p className="text-white">{generalname}</p>
        <p className="text-yellow">{name}</p>
      </h3>
      <span className="text-18med laptop:text-54bold text-white">
        {priceDiscount}
      </span>
      <span className="text-14bold laptop:text-22bold text-grey line-through">
        {price}
      </span>
      <span className="text-10med laptop:text-16med text-yellow"></span>
      <Button>{t("buttons.makeOrder")}</Button>
    </div>
  );
}
