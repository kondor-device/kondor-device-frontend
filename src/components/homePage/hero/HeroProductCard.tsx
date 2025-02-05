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

  const { name, price, priceDiscount, coloropts } = product;

  const { photos } = coloropts[0];

  return (
    <li
      className="flex flex-col justify-between w-[48.5%] deskxl:w-[48%] max-w-[350px] rounded-[18px] laptop:rounded-[24px] deskxl:rounded-[40px] p-[18px] laptop:p-[22px] deskxl:py-[30px] deskxl:px-10 
    shadow-card bg-white"
    >
      <div className="flex items-center justify-center w-full aspect-[1/1]">
        <Image
          src={photos[0].url}
          alt={photos[0].alt || "keyboard"}
          width={1080}
          height={1080}
          className="w-[100%] tab:w-[85%] laptop:w-[65%] deskxl:size-[52.3%] mx-auto my-auto"
        />
      </div>
      <h3 className="mt-auto mb-[11px] desk:mb-[15px] deskxl:mb-[25px] text-14bold sm:text-20bold deskxl:text-32bold text-center">
        {name}
      </h3>
      <Link
        href={locale === "uk" ? `/#catalog` : `/${locale}#catalog`}
        className="block w-fit mx-auto"
      >
        <SmallButton>{`${t("homePage.hero.from")} ${(
          priceDiscount || price
        ).toString()} ${t("homePage.catalog.hrn")}`}</SmallButton>
      </Link>
    </li>
  );
}
