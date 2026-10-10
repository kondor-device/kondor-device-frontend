import SmallButton from "@/components/shared/buttons/SmallButton";
import { ProductItem } from "@/types/productItem";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { formatSum } from "@/utils/formatSum";
import { Link } from "@/i18n/routing";
import AnimationWrapper from "./AnimationWrapper";

interface HeroProductCardProps {
  product: ProductItem;
  index: number;
}

// Cards appear one after another; full class names, so Tailwind can see them
const APPEAR_DELAYS = [
  "delay-[900ms]",
  "delay-[1050ms]",
  "delay-[1200ms]",
  "delay-[1350ms]",
  "delay-[1500ms]",
  "delay-[1650ms]",
];

export default function HeroProductCard({
  product,
  index,
}: HeroProductCardProps) {
  const t = useTranslations();

  const { name, price, priceDiscount, coloropts, cat } = product;

  const { photos } = coloropts[0];

  const catalogLink = "/#catalog";
  const categoryLink = `/#${cat?.id}`;

  return (
    <li className="shrink-0 w-[137px] h-[201px] sm:w-[166px] sm:h-[243px] snap-start">
      <AnimationWrapper
        sectionId="home-page-hero"
        commonStyles={`flex flex-col items-center w-full h-full overflow-hidden rounded-[24px] sm:rounded-[30px] px-[10px] pt-[14px] pb-[12px] sm:pt-[24px] sm:pb-[18px] shadow-card bg-surface transition duration-1000 ease-slow ${APPEAR_DELAYS[index] ?? APPEAR_DELAYS[APPEAR_DELAYS.length - 1]}`}
        visibleStyles="opacity-100 translate-y-0"
        unVisibleStyles="opacity-0 translate-y-[16px]"
      >
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
      </AnimationWrapper>
    </li>
  );
}
