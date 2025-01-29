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
      <Button className="w-full max-w-[350px] deskxl:max-w-[437px] deskxl:w-[437px] mx-auto mt-5 tabxl:mt-10 laptop::mt-[60px]">
        {t("buttons.makeOrder")}
      </Button>
    </Section>
  );
}
