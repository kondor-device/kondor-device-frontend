"use client";

import { useTranslations } from "next-intl";
import React from "react";
import PopUpTitle from "../../../../shared/titles/PopUpTitle";
import { ComplectItem } from "@/types/productItem";
import ComplectationList from "./ComplectationList";

interface CharacteristicsPopUpProps {
  complectation: ComplectItem[];
}

export default function Complectation({
  complectation,
}: CharacteristicsPopUpProps) {
  const t = useTranslations();

  return (
    <>
      <PopUpTitle>{t("homePage.catalog.set")}</PopUpTitle>
      <ComplectationList complectation={complectation} />
    </>
  );
}
