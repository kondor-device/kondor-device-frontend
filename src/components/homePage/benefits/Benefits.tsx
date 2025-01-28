import Section from "@/components/shared/section/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import React from "react";
import { useTranslations } from "next-intl";
import BenefitsList from "./BenefitsList";
import Button from "@/components/shared/buttons/Button";

export default function Benefits() {
  const t = useTranslations();

  return (
    <Section className="pb-[60px] laptop:pb-[100px]">
      <SectionTitle className="text-center">
        {t("homePage.benefits.title")}
      </SectionTitle>
      <BenefitsList />
      <Button className="mx-auto mt-5 laptop:mt-[60px]">
        {t("buttons.makeOrder")}
      </Button>
    </Section>
  );
}
