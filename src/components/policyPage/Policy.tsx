import React from "react";
import PageTitle from "../shared/titles/PageTitle";
import { useTranslations } from "next-intl";

export default function Policy() {
  const t = useTranslations("");
  return (
    <>
      {" "}
      <PageTitle>{t("policyPage.title")}</PageTitle>
    </>
  );
}
