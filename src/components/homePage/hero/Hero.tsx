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
    <section className="relative laptop:h-[710px] deskxl:h-[1020px]">
      <Image
        src="/images/bgImages/homeHero/keyboards.webp"
        alt="keyboards"
        width={1678}
        height={2045}
        className="hidden laptop:block absolute top-0 left-0 -z-20 w-[35%] laptop:w-[570px] deskxl:w-[43.7%] h-auto"
      />
      <div className="flex flex-col laptop:flex-row laptop:justify-between container w-full max-w-[1920px] pt-[60px] laptop:pt-[20px] deskxl:pt-[100px] scroll-mt-8 tabxl:scroll-mt-[63px] h-full pb-[60px] laptop:pb-[50px] deskxl:pb-[100px]">
        <div className="my-auto">
          <HeroTitle />
          <Link
            href={locale === "uk" ? `/#catalog` : `/${locale}#catalog`}
            className="hidden laptop:block w-full tab:w-fit max-w-[350px] laptop:max-w-[437px] laptop:w-[437px] laptop:h-[85px] mt-[30px] laptop:mt-[42px] mx-auto laptop:mx-0"
          >
            <Button className="w-full">{t("buttons.goToCatalog")}</Button>
          </Link>
        </div>
        <HeroProducts />
        <Link
          href={locale === "uk" ? `/#catalog` : `/${locale}#catalog`}
          className="block laptop:hidden w-full max-w-[350px] laptop:h-[85px] mx-auto"
        >
          <Button className="w-full">{t("buttons.goToCatalog")}</Button>
        </Link>
      </div>
    </section>
  );
}
