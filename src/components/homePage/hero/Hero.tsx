import Section from "@/components/shared/section/Section";
import React from "react";
import HeroTitle from "./HeroTitle";
import Button from "@/components/shared/buttons/Button";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import HeroProducts from "./HeroProducts";

export default function Hero() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="relative laptop:aspect-[1280/571] deskxl:aspect-[1920/1021]">
      <Image
        src="/images/bgImages/homeHero/keyboards.webp"
        alt="keyboards"
        width={1678}
        height={2045}
        className="hidden laptop:block absolute top-0 left-0 -z-20 w-[35%] deskxl:w-[43.7%] h-auto"
      />
      <Section className="flex flex-col h-full pb-[60px] laptop:pb-[100px]">
        <div className="my-auto">
          <HeroTitle />
          <Link
            href={locale === "uk" ? `/#catalog` : `/${locale}#catalog`}
            className="block w-full tab:w-fit max-w-[350px] laptop:max-w-[437px] laptop:w-[437px] laptop:h-[85px] mt-[30px] laptop:mt-[42px] mx-auto laptop:mx-0"
          >
            <Button className="w-full">{t("buttons.goToCatalog")}</Button>
          </Link>
        </div>
        <HeroProducts />
      </Section>
    </div>
  );
}
