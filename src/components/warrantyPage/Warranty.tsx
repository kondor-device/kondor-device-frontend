import React from "react";
import PageTitle from "../shared/titles/PageTitle";
import { useTranslations } from "next-intl";

export default function Warranty() {
  const t = useTranslations("warrantyPage");

  return (
    <div>
      <PageTitle>{t("title")}</PageTitle>
    </div>
  );
}
