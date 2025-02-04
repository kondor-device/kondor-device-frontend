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
      className="flex flex-col justify-between w-[48.5%] deskxl:w-[48%] max-w-[350px] laptop:max-w-full rounded-[18px] laptop:rounded-[24px] deskxl:rounded-[40px] p-[18px] desk:px-[22px] desk:py-[30px] deskxl:py-[30px] deskxl:px-10 
    shadow-card bg-white"
    >
      <div>
        <Image
          src={photos[0].url}
          alt={photos[0].alt || "keyboard"}
          width={1080}
          height={1080}
          className="w-[65%] tab:w-[55%] deskxl:size-[52.3%] mx-auto"
        />
        <h3 className="mt-auto mb-[11px] desk:mb-[20px] deskxl:mb-[25px] text-14bold tab:text-22bold desk:text-24bold deskxl:text-32bold text-center">
          {name}
        </h3>
      </div>
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
