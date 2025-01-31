import Section from "@/components/shared/section/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import BenefitsList from "./BenefitsList";
import Button from "@/components/shared/buttons/Button";
import { Link } from "@/i18n/routing";

export default function Benefits() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Section className="pb-[60px] laptop:pb-[100px]">
      <SectionTitle>{t("homePage.benefits.title")}</SectionTitle>
      <BenefitsList />
      <Link
        href={locale === "uk" ? `/#catalog` : `/${locale}#catalog`}
        className="block w-fit max-w-[350px] deskxl:max-w-[437px] deskxl:w-[437px] 
      mx-auto mt-5 tabxl:mt-10 laptop::mt-[60px]"
      >
        <Button>{t("buttons.makeOrder")}</Button>
      </Link>
    </Section>
  );
}
