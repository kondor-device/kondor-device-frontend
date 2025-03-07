import Section from "@/components/shared/section/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import BenefitsList from "./BenefitsList";
import Button from "@/components/shared/buttons/Button";
import { Link } from "@/i18n/routing";

const SECTION_ID = "home-page-benefits";

export default function Benefits() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Section id={SECTION_ID} className="pb-[60px] laptop:pb-[100px]">
      <SectionTitle>{t("homePage.benefits.title")}</SectionTitle>
      <BenefitsList />
      <Link
        href={locale === "uk" ? `/#catalog` : `/${locale}#catalog`}
        className="block w-fit
      mx-auto mt-5 tabxl:mt-10 laptop::mt-[60px]"
      >
        <Button className="w-full laptop:w-[350px] deskxl:w-[437px] max-w-[327px] laptop:max-w-[350px] deskxl:max-w-[437px]">
          {t("buttons.makeOrder")}
        </Button>
      </Link>
    </Section>
  );
}
