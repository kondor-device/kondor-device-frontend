"use client";

import { useTranslations } from "next-intl";
import React from "react";
import PopUpTitle from "../../../../shared/titles/PopUpTitle";
import CharacteristicsList from "./CharacteristicsList";
import { Characteristic } from "@/types/productItem";

interface CharacteristicsPopUpProps {
  characteristics: Characteristic[];
}

export default function Characteristics({
  characteristics,
}: CharacteristicsPopUpProps) {
  const t = useTranslations();

  return (
    <>
      <PopUpTitle>{t("homePage.catalog.generalCharacteristics")}</PopUpTitle>
      <CharacteristicsList characteristics={characteristics} />
    </>
  );
}
