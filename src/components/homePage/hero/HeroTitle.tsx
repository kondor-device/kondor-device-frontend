import React from "react";
import { useLocale, useTranslations } from "next-intl";
import AnimationWrapper from "./AnimationWrapper";

export default function HeroTitle() {
  const t = useTranslations("homePage.hero.title");
  const locale = useLocale();

  return (
    <h1
      className={`inline-flex flex-col text-22bold tabxl:text-32bold laptop:text-40bold desk:text-45bold leading-[33px] uppercase ${
        // The Russian title is narrower, which shifts the product cards block to the left.
        // Same width as the Ukrainian title (in em, so it scales with the font size)
        locale === "ru" ? "tabxl:min-w-[13.22em]" : ""
      }`}
    >
      <AnimationWrapper
        sectionId="home-page-hero"
        commonStyles="w-fit relative transition duration-1000 ease-slow"
        visibleStyles="opacity-100 translate-y-0"
        unVisibleStyles="opacity-0 translate-y-[50px] tab:translate-y-[100px]"
      >
        <AnimationWrapper
          sectionId="home-page-hero"
          commonStyles="absolute -top-1 -right-4 -z-10 w-screen h-[39px] tabxl:h-[44px] laptop:h-[49px] desk:h-[70px] rounded-[12px] laptop:rounded-[20px] bg-yellowGradient transition delay-700 duration-1000 ease-slow"
          visibleStyles="opacity-100 translate-x-0"
          unVisibleStyles="opacity-0 -translate-x-full"
        />
        <p className="text-dark">{t("partOne")}</p>
      </AnimationWrapper>
      <AnimationWrapper
        sectionId="home-page-hero"
        commonStyles="transition duration-1000 ease-slow"
        visibleStyles="opacity-100 translate-y-0"
        unVisibleStyles="opacity-0 translate-y-[50px] tab:translate-y-[100px]"
      >
        <p>{t("partTwo")}</p>
        <p>{t("partThree")}</p>
      </AnimationWrapper>
    </h1>
  );
}
