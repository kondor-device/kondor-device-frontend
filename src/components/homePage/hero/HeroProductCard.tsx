import SmallButton from "@/components/shared/buttons/SmallButton";
import { ProductItem } from "@/types/productItem";
import Image from "next/image";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import AnimationWrapper from "./AnimationWrapper";

interface HeroProductCardProps {
  product: ProductItem;
}

export default function HeroProductCard({ product }: HeroProductCardProps) {
  const t = useTranslations();
  const locale = useLocale();

  const { name, price, priceDiscount, coloropts, cat } = product;

  const { photos } = coloropts[0];

  const localizedCatalogLink =
    locale === "uk" ? `/#catalog` : `/${locale}#catalog`;
  const localizedCategoryLink =
    locale === "uk" ? `/#${cat?.name}` : `/${locale}#${cat?.name}`;

  return (
    <li
      className="flex flex-col justify-between w-[48.5%] deskxl:w-[48%] max-w-[350px] rounded-[18px] laptop:rounded-[24px] deskxl:rounded-[40px] p-[18px] laptop:p-[22px] deskxl:py-[30px] deskxl:px-10 
    shadow-card bg-white"
    >
      <div className="flex items-center justify-center w-full tab:w-[85%] laptop:w-[65%] deskxl:size-[52.3%] aspect-[1/1] mx-auto my-auto overflow-hidden">
        <AnimationWrapper
          sectionId="home-page-hero"
          commonStyles="transition duration-1000 ease-slow"
          visibleStyles="scale-100 opacity-100"
          unVisibleStyles="scale-[115%] opacity-0"
        >
          <Link
            href={cat?.name ? localizedCategoryLink : localizedCatalogLink}
            className="block w-fit mx-auto"
          >
            <Image
              src={photos[0].url}
              alt={photos[0].alt || "keyboard"}
              width={1080}
              height={1080}
              priority
              className="w-full h-auto"
            />
          </Link>
        </AnimationWrapper>
      </div>
      <h2 className="mt-auto mb-[11px] desk:mb-[15px] deskxl:mb-[25px] text-14bold sm:text-20bold deskxl:text-32bold text-center">
        {name}
      </h2>
      <Link
        href={cat?.name ? localizedCategoryLink : localizedCatalogLink}
        className="block w-fit mx-auto"
      >
        <SmallButton>{`${t("homePage.hero.from")} ${(
          priceDiscount || price
        ).toString()} ${t("homePage.catalog.hrn")}`}</SmallButton>
      </Link>
    </li>
  );
}
