import Section from "@/components/shared/section/Section";
import React from "react";
import HeroTitle from "./HeroTitle";
import Button from "@/components/shared/buttons/Button";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

export default function Hero() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Section>
      <HeroTitle />
      <Link
        href={locale === "uk" ? `/#catalog` : `/${locale}#catalog`}
        className="block w-fit mt-[30px] laptop:mt-[42px] mx-auto laptop:mx-0"
      >
        <Button>{t("buttons.goToCatalog")}</Button>
      </Link>
    </Section>
  );
}
