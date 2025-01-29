import React from "react";
import PageTitle from "../shared/titles/PageTitle";
import { useTranslations } from "next-intl";
import WarrantyInfo from "./WarrantyInfo";
import Button from "../shared/buttons/Button";

export default function Warranty() {
  const t = useTranslations("");

  return (
    <>
      <PageTitle>{t("warrantyPage.title")}</PageTitle>
      <section className="container max-w-[1920px] pb-5 laptop:pb-[100px]">
        <WarrantyInfo />
        <Button>{t("buttons.haveQuestions")}</Button>
      </section>
    </>
  );
}
