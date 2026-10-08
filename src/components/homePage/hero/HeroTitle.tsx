import React from "react";
import { useTranslations } from "next-intl";
import AnimationWrapper from "./AnimationWrapper";

export default function HeroTitle() {
  const t = useTranslations("homePage.hero.title");

  // max-w is in em: both locales break into the lines of the design at this width
  return (
    <h1 className="max-w-[12em] text-[32px] sm:text-[36px] tab:text-[40px] tabxl:text-[48px] laptop:text-[60px] desk:text-[76px] deskxl:text-[88px] font-bold leading-[0.97] uppercase">
      <AnimationWrapper
        sectionId="home-page-hero"
        commonStyles="transition duration-1000 ease-slow"
        visibleStyles="opacity-100 translate-y-0"
        unVisibleStyles="opacity-0 translate-y-[50px] tab:translate-y-[100px]"
      >
        {t("before")} <span className="text-yellow">{t("accent")}</span>{" "}
        {t("after")}
      </AnimationWrapper>
    </h1>
  );
}
