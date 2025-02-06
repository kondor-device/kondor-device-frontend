import React from "react";
import { useTranslations } from "next-intl";

export default function EmptyComplectation() {
  const t = useTranslations("homePage.catalog");

  return (
    <div className="py-5 laptop:py-[40px]">
      <p className="text-12med laptop:text-18med text-center text-grey">
        {t("noComplectation")}
      </p>
    </div>
  );
}
