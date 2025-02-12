import React from "react";
import { useTranslations } from "next-intl";
import AnimationWrapper from "./AnimationWrapper";

export default function HeroTitle() {
  const t = useTranslations("homePage.hero.title");

  return (
    <h1 className="inline-flex flex-col text-22bold laptop:text-40bold desk:text-45bold leading-[33px] uppercase">
      <AnimationWrapper
        sectionId="home-page-hero"
        commonStyles="w-fit relative transition duration-1000 ease-slow"
        visibleStyles="opacity-100 translate-y-0"
        unVisibleStyles="opacity-0 translate-y-[50px] tab:translate-y-[100px]"
      >
        <AnimationWrapper
          sectionId="home-page-hero"
          commonStyles="absolute -top-1 -right-4 -z-10 w-screen h-[39px] laptop:h-[49px] desk:h-[70px] rounded-[12px] laptop:rounded-[20px] bg-yellowGradient transition delay-700 duration-1000 ease-slow"
          visibleStyles="opacity-100 translate-x-0"
          unVisibleStyles="opacity-0 -translate-x-full"
        >
          1
        </AnimationWrapper>
        <p>{t("partOne")}</p>
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
