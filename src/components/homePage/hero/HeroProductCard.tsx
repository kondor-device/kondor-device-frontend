import SmallButton from "@/components/shared/buttons/SmallButton";
import { ProductItem } from "@/types/productItem";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { formatSum } from "@/utils/formatSum";
import { Link } from "@/i18n/routing";

interface HeroProductCardProps {
  product: ProductItem;
}

export default function HeroProductCard({ product }: HeroProductCardProps) {
  const t = useTranslations();

  const { name, price, priceDiscount, coloropts, cat } = product;

  const { photos } = coloropts[0];

  const catalogLink = "/#catalog";
  const categoryLink = `/#${cat?.id}`;

  return (
    <li className="flex flex-col items-center shrink-0 w-[137px] h-[201px] sm:w-[166px] sm:h-[243px] snap-start overflow-hidden rounded-[24px] sm:rounded-[30px] px-[10px] pt-[14px] pb-[12px] sm:pt-[24px] sm:pb-[18px] shadow-card bg-surface">
      <div className="flex items-center justify-center w-[84%] sm:w-[80%] aspect-[1/1] mx-auto my-auto rounded-[12px] bg-white overflow-hidden">
        <Link
          href={cat?.id ? categoryLink : catalogLink}
          className="group block w-fit mx-auto"
        >
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
      <h2 className="mt-auto mb-2 sm:mb-[10px] pt-3 text-14bold sm:text-16bold text-center">
        {name}
      </h2>
      <Link
        href={cat?.id ? categoryLink : catalogLink}
        className="block w-full max-w-[146px] mx-auto"
      >
        <SmallButton className="!w-full !px-2 !text-[13px] sm:!text-[14px] !border-2 sm:!border-2">{`${t(
          "homePage.hero.from",
        )} ${formatSum(priceDiscount || price).toString()} ${t(
          "homePage.catalog.hrn",
        )}`}</SmallButton>
      </Link>
    </li>
  );
}
