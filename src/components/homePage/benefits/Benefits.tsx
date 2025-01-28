import Section from "@/components/shared/section/Section";
import SectionTitle from "@/components/shared/footer/titles/SectionTitle";
import React from "react";
import { useTranslations } from "next-intl";

export default function Benefits() {
  const t = useTranslations();

  return (
    <Section>
      <SectionTitle className="text-center">
        {t("homePage.benefits.title")}
      </SectionTitle>
    </Section>
  );
}
