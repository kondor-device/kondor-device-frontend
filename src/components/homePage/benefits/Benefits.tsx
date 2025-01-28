import Section from "@/components/shared/section/Section";
import SectionTitle from "@/components/shared/footer/titles/SectionTitle";
import React from "react";
import { useTranslations } from "next-intl";
import BenefitsList from "./BenefitsList";

export default function Benefits() {
  const t = useTranslations();

  return (
    <Section className="pb-[60px] laptop:pb-[100px]">
      <SectionTitle className="text-center">
        {t("homePage.benefits.title")}
      </SectionTitle>
      <BenefitsList />
    </Section>
  );
}
