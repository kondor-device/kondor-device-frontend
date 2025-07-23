import SmallButton from "@/components/shared/buttons/SmallButton";
import { ProductItem } from "@/types/productItem";
import Image from "next/image";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatSum } from "@/utils/formatSum";
import { Link } from "@/i18n/routing";

interface HeroProductCardProps {
  product: ProductItem;
}

export default function HeroProductCard({ product }: HeroProductCardProps) {
  const t = useTranslations();
  const locale = useLocale();

  const { name, price, priceDiscount, coloropts, slug } = product;

  const { photos } = coloropts[0];

  const searchParams =
    "&priceTo=4999&sort=price-ascending&priceFrom=599&availability=in-stock%2Cpre-order";

  const localizedCatalogLink =
    locale === "uk"
      ? `/catalog?type=${slug}${searchParams}`
      : `/${locale}/catalog?type=${slug}${searchParams}`;

  return (
    <li
      className="flex flex-col justify-between w-[48.5%] tabxl:w-[47%] laptop:w-[48.5%] deskxl:w-[48%] max-w-[350px] rounded-[18px] tabxl:rounded-[24px] deskxl:rounded-[40px] p-[18px] tabxl:p-[22px] deskxl:py-[30px] deskxl:px-10 
    shadow-card bg-white"
    >
      <div className="flex items-center justify-center w-full tab:w-[85%] tabxl:w-[65%] deskxl:size-[90%] aspect-[1/1] mx-auto my-auto">
        <Link href={localizedCatalogLink} className="group block w-fit mx-auto">
          <Image
            src={photos[0].url}
            alt={photos[0].alt || "keyboard"}
            width={1080}
            height={1080}
            priority
            className="w-full h-auto scale-100 tabxl:group-hover:scale-105 transition duration-1000 ease-out"
          />
        </Link>
      </div>
      <h2 className="mt-auto mb-[11px] desk:mb-[15px] deskxl:mb-[25px] text-12bold mob:text-14bold sm:text-20bold tabxl:text-18bold laptop:text-20bold deskxl:text-28bold text-center">
        {name}
      </h2>
      <Link href={localizedCatalogLink} className="block w-fit mx-auto">
        <SmallButton>{`${t("homePage.hero.from")} ${formatSum(
          priceDiscount || price
        ).toString()} ${t("homePage.catalog.hrn")}`}</SmallButton>
      </Link>
    </li>
  );
}
