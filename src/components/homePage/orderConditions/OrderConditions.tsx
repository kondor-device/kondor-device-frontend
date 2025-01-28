import SectionTitle from "@/components/shared/footer/titles/SectionTitle";
import Section from "@/components/shared/section/Section";
import React from "react";
import { useTranslations } from "next-intl";

export default function OrderConditions() {
  const t = useTranslations();

  return (
    <Section id="delivery">
      <SectionTitle>{t("homePage.orderConditions.title")}</SectionTitle>
    </Section>
  );
}
