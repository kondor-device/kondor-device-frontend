import SmallButton from "@/components/shared/buttons/SmallButton";
import { ProductItem } from "@/types/productItem";
import Image from "next/image";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface HeroProductCardProps {
  product: ProductItem;
}

export default function HeroProductCard({ product }: HeroProductCardProps) {
  const t = useTranslations();
  const locale = useLocale();

  const { name, priceDiscount, coloropts } = product;

  const { photos } = coloropts[0];

  return (
    <li
      className="flex flex-col justify-between w-[48.5%] rounded-[18px] laptop:rounded-[40px] p-[18px] laptop:py-[30px] laptop:px-[50px] 
    shadow-card bg-white"
    >
      <div>
        <Image
          src={photos[0].url}
          alt={photos[0].alt || "keyboard"}
          width={1080}
          height={1080}
          className="w-[65%] laptop:size-[52.3%] mx-auto"
        />
        <h3 className="mt-auto mb-[11px] laptop:mb-[25px] text-14bold laptop:text-32bold text-center">
          {name}
        </h3>
      </div>
      <Link
        href={locale === "uk" ? `/#catalog` : `/${locale}#catalog`}
        className="block w-fit mx-auto"
      >
        <SmallButton>{`${t(
          "homePage.hero.from"
        )} ${priceDiscount.toString()} ${t(
          "homePage.catalog.hrn"
        )}`}</SmallButton>
      </Link>
    </li>
  );
}
