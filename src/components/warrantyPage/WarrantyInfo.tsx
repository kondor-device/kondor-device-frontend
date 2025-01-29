import React from "react";
import { useTranslations } from "next-intl";

export default function WarrantyInfo() {
  const t = useTranslations("warrantyPage");

  return (
    <div className="pb-[30px] laptop:pb-[50px]">
      <p className="mb-5">{t("partOne")}</p>
      <p>{t("partTwo")}</p>
    </div>
  );
}
