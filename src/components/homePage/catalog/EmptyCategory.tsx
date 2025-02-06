import { useTranslations } from "next-intl";
import React from "react";

export default function EmptyCategory() {
  const t = useTranslations("homePage.catalog");

  return (
    <div className="container w-full max-w-[1920px] pb-5 laptop:pt-5 laptop:pb-[40px]">
      <p className="text-12med laptop:text-18med text-center text-grey">
        {t("noProducts")}
      </p>
    </div>
  );
}
