import React from "react";
import { useTranslations } from "next-intl";

export default function HeroTitle() {
  const t = useTranslations("homePage.hero.title");

  return (
    <h1 className="inline-flex flex-col text-22bold laptop:text-45bold leading-[33px] uppercase">
      <span
        className="relative before:content-[''] before:absolute before:-top-1 before:-right-3 laptop:before:-right-4 before:-z-10 before:w-screen 
        before:h-[39px] laptop:before:h-[70px] before:bg-yellowGradient before:rounded-[12px] laptop:before:rounded-[20px]"
      >
        {t("partOne")}
      </span>
      <span>{t("partTwo")}</span>
      <span>{t("partThree")}</span>
    </h1>
  );
}
