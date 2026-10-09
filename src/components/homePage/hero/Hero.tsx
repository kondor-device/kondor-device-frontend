import React from "react";
import HeroTitle from "./HeroTitle";
import Button from "@/components/shared/buttons/Button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import HeroProducts from "./HeroProducts";
import { ProductItem } from "@/types/productItem";
import AnimationWrapper from "./AnimationWrapper";
import { CategoryItem } from "@/types/categoryItem";
import { getHeroProducts } from "@/utils/homeCatalog";

interface HeroProps {
  shownOnMainProducts: ProductItem[];
  categories: CategoryItem[];
}

const SECTION_ID = "home-page-hero";

export default function Hero({ shownOnMainProducts, categories }: HeroProps) {
  const t = useTranslations();

  const categoriesList = categories
    ? categories
        .sort((a, b) => a.pos - b.pos)
        .map((category) => ({
          title: category.name,
          category: category.slug,
        }))
    : [];

  const allCategoriesSlugs = categoriesList.map((c) => c.category).join(",");

  const searchParams =
    "&priceTo=4999&sort=default&priceFrom=499&availability=in-stock%2Cpre-order";

  return (
    <section id={SECTION_ID} className="relative pb-[40px] laptop:pb-[34px]">
      {/* Mobile: yellow circle peeking from under the header at the top right */}
      <AnimationWrapper
        sectionId={SECTION_ID}
        commonStyles="sm:hidden absolute -z-10 top-[-175px] left-[330px] size-[280px] transition delay-300 duration-[1500ms] ease-slow"
        visibleStyles="opacity-100"
        unVisibleStyles="opacity-0"
      >
        <Image
          src="/images/bgImages/homeHero/circle.svg"
          alt=""
          aria-hidden="true"
          width={280}
          height={280}
          priority
          className="size-full max-w-none"
        />
      </AnimationWrapper>
      {/* Desktop: devices on the yellow shape. Same size and place as at 768px on every wider screen, pinned to the left edge: a wider screen gradually reveals more of the picture instead of cropping it */}
      <AnimationWrapper
        sectionId={SECTION_ID}
        commonStyles="hidden sm:block absolute -z-10 top-[-55px] left-[310px] w-[680px] tab:top-[-80px] tab:left-[295px] tab:w-[790px] tabxl:top-[-115px] tabxl:left-[345px] tabxl:w-[980px] laptop:top-[-125px] laptop:left-[470px] laptop:w-[980px] desk:top-[-170px] desk:left-[600px] desk:w-[1230px] deskxl:top-[-160px] deskxl:left-[780px] deskxl:w-[1350px] max-w-none transition delay-300 duration-[1500ms] ease-slow"
        visibleStyles="opacity-100"
        unVisibleStyles="opacity-0"
      >
        <Image
          src="/images/bgImages/homeHero/devices-desktop.webp"
          alt="Kondor keyboards and mouse"
          width={2005}
          height={1795}
          priority
          className="w-full h-auto max-w-none"
        />
      </AnimationWrapper>

      <div className="container w-full max-w-[1920px] pt-[44px] sm:pt-[67px] desk:pt-[47px] deskxl:pt-[120px]">
        <HeroTitle />
        <AnimationWrapper
          sectionId={SECTION_ID}
          commonStyles="transition delay-[400ms] duration-1000 ease-slow"
          visibleStyles="opacity-100 translate-y-0"
          unVisibleStyles="opacity-0 translate-y-[50px] sm:translate-y-[100px]"
        >
          <p className="max-w-[350px] sm:max-w-[370px] deskxl:max-w-[520px] mt-6 sm:mt-[44px] desk:mt-[30px] deskxl:mt-[44px] text-16med sm:text-14med deskxl:text-20med">
            {t("homePage.hero.description")}
          </p>
        </AnimationWrapper>
        <AnimationWrapper
          sectionId={SECTION_ID}
          commonStyles="relative z-10 transition delay-[700ms] duration-1000 ease-slow"
          visibleStyles="opacity-100 translate-y-0"
          unVisibleStyles="opacity-0 max-sm:translate-y-[20px] laptop:translate-y-[50px]"
        >
          <Link
            href={`/catalog?type=${allCategoriesSlugs}${searchParams}`}
            className="block w-full max-w-[565px] sm:max-w-[340px] deskxl:max-w-[480px] mt-8 sm:mt-[38px]"
          >
            <Button className="w-full !min-h-[60px] sm:!min-h-[68px] deskxl:!min-h-[92px] !py-0">
              {t("buttons.goToCatalog")}
            </Button>
          </Link>
        </AnimationWrapper>
      </div>

      {/* Mobile: devices between the button and the product cards */}
      <div aria-hidden="true" className="sm:hidden relative w-full h-[246px]">
        {/* Fixed 602x494 frame (476x390 + 15% + 10%) on any screen width (on a narrower screen the right part goes past the screen edge); the picture is trimmed top and bottom, not stretched */}
        <AnimationWrapper
          sectionId={SECTION_ID}
          commonStyles="absolute top-[-139px] left-[-98px] w-[602px] h-[494px] max-w-none overflow-hidden transition delay-500 duration-[1500ms] ease-slow"
          visibleStyles="opacity-100"
          unVisibleStyles="opacity-0"
        >
          <Image
            src="/images/bgImages/homeHero/devices-mobile.webp"
            alt=""
            fill
            priority
            sizes="602px"
            unoptimized
            className="object-cover"
          />
        </AnimationWrapper>
      </div>

      <div className="relative z-[1] container w-full max-w-[1920px] sm:mt-[52px] desk:mt-[36px] deskxl:mt-[52px]">
        <HeroProducts
          shownOnMainProducts={getHeroProducts(shownOnMainProducts, categories)}
        />
      </div>
    </section>
  );
}
