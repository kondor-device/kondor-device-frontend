import Section from "@/components/shared/section/Section";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import React from "react";
import { useTranslations } from "next-intl";
import BenefitsList from "./BenefitsList";
import Button from "@/components/shared/buttons/Button";
import { Link } from "@/i18n/routing";

const SECTION_ID = "home-page-benefits";

export default function Benefits() {
  const t = useTranslations();

  return (
    <Section id={SECTION_ID} className="pb-[60px] laptop:pb-[100px]">
      <SectionTitle className="uppercase">
        {t("homePage.benefits.title")}
      </SectionTitle>
      <BenefitsList />
      <div className="flex items-center gap-x-5 laptop:gap-x-8 mt-5 tabxl:mt-10 laptop:mt-[60px]">
        <Link href="/#catalog" className="block w-full sm:w-fit sm:shrink-0">
          <Button className="enabled:!bg-none enabled:!bg-dark dark:enabled:!bg-white !text-white dark:!text-dark w-full laptop:w-[350px] deskxl:w-[437px] sm:max-w-[327px] laptop:max-w-[350px] deskxl:max-w-[437px]">
            {t("buttons.makeOrder")}
          </Button>
        </Link>
        <div
          aria-hidden="true"
          className="relative hidden sm:flex flex-1 min-w-0 items-center h-11 overflow-hidden"
        >
          <span
            className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2"
            style={{
              backgroundImage: "linear-gradient(to right, #FFB505, #fff)",
              maskImage:
                "repeating-linear-gradient(to right, #000 0 9px, transparent 9px 18px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to right, #000 0 9px, transparent 9px 18px)",
            }}
          />
          <span className="relative shrink-0 size-11 rounded-full bg-yellow" />
          <span className="relative shrink-0 ml-4 size-8 rounded-full bg-yellow" />
        </div>
      </div>
    </Section>
  );
}
