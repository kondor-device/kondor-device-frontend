import Section from "@/components/shared/section/Section";
import React from "react";
import { useTranslations } from "next-intl";
import Stages from "./Stages";
import Image from "next/image";

export default function OrderConditions() {
  const t = useTranslations();

  return (
    <Section
      id="delivery"
      className="flex flex-col gap-y-5 tab:flex-row-reverse tab:gap-x-8 laptop:gap-x-[69px] items-center tab:justify-center"
    >
      <div className="laptop:w-[47%]">
        <h2 className="mb-5 laptop:mb-[45px] text-22bold laptop:text-32bold desk:text-40bold text-center laptop:text-left">
          {t("homePage.orderConditions.title")}
        </h2>
        <Stages />
      </div>
      <Image
        src="/images/contentImages/homeOrderConditions/twoKeyboards.webp"
        alt="two keyboards"
        width="1377"
        height="1405"
        className="w-full max-w-[545px] tab:max-w-full tab:w-[360px] laptop:w-[547px] desk:w-[688px] h-auto aspect-[1377/1405]"
      />
    </Section>
  );
}
