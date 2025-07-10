import React from "react";
import HeroTitle from "./HeroTitle";
import Button from "@/components/shared/buttons/Button";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import HeroProducts from "./HeroProducts";
import { ProductItem } from "@/types/productItem";
import AnimationWrapper from "./AnimationWrapper";

interface HeroProps {
  shownOnMainProducts: ProductItem[];
}

const SECTION_ID = "home-page-hero";

export default function Hero({ shownOnMainProducts }: HeroProps) {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <section
      id={SECTION_ID}
      className="relative tabxl:h-[710px] deskxl:h-[1020px]"
    >
      <AnimationWrapper
        sectionId={SECTION_ID}
        commonStyles="transition delay-[1700ms] duration-[2000ms] ease-slow"
        visibleStyles="opacity-100"
        unVisibleStyles="opacity-0"
      >
        <Image
          src="/images/bgImages/homeHero/keyboards.webp"
          alt="keyboards"
          width={1678}
          height={2045}
          className="hidden tabxl:block absolute top-0 left-0 -z-20 w-[35%] tabxl:w-[540px] laptop:w-[570px] deskxl:w-[43.7%] max-w-[839px] h-auto"
        />
      </AnimationWrapper>
      <div className="flex flex-col tabxl:flex-row laptop:justify-between tabxl:gap-x-10 container w-full max-w-[1920px] pt-[40px] tabxl:pt-[20px] deskxl:pt-[100px] h-full pb-[60px] tabxl:pb-[50px] deskxl:pb-[100px]">
        <div className="my-auto">
          <HeroTitle />
          <AnimationWrapper
            sectionId={SECTION_ID}
            commonStyles="transition delay-[1700ms] duration-1000 ease-slow"
            visibleStyles="opacity-100 translate-y-0"
            unVisibleStyles="opacity-0 laptop:translate-y-[50px]"
          >
            <Link
              href={
                locale === "uk"
                  ? `/catalog?category=all`
                  : `/${locale}/catalog?category=all`
              }
              className="hidden tabxl:block w-[350px] max-w-[350px] laptop:max-w-[437px] laptop:w-[437px] tabxl:h-[85px] mt-[30px] tabxl:mt-[42px] mx-auto tabxl:mx-0"
            >
              <Button className="w-full">{t("buttons.goToCatalog")}</Button>
            </Link>
          </AnimationWrapper>
        </div>
        <HeroProducts shownOnMainProducts={shownOnMainProducts} />
        <Link
          href={locale === "uk" ? `/#catalog` : `/${locale}#catalog`}
          className="block tabxl:hidden w-full max-w-[350px] tabxl:h-[85px] mx-auto"
        >
          <Button className="w-full">{t("buttons.goToCatalog")}</Button>
        </Link>
      </div>
    </section>
  );
}
