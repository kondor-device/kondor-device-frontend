import Section from "@/components/shared/section/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import React from "react";
import { useTranslations } from "next-intl";

export default function Faq() {
  const t = useTranslations();

  return (
    <Section id="faq">
      <SectionTitle className="text-center">
        {t("homePage.faq.title")}
      </SectionTitle>
    </Section>
  );
}
