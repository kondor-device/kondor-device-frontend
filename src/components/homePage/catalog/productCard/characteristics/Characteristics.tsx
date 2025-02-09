"use client";

import { useTranslations } from "next-intl";
import React from "react";
import PopUpTitle from "../../../../shared/titles/PopUpTitle";
import CharacteristicsList from "./CharacteristicsList";
import { Characteristic } from "@/types/productItem";
import { useModalStore } from "@/store/modalStore";

interface CharacteristicsPopUpProps {
  characteristics: Characteristic[];
}

export default function Characteristics({
  characteristics,
}: CharacteristicsPopUpProps) {
  const t = useTranslations();
  const { activeModal } = useModalStore((state) => state);

  return (
    <div
      className={
        activeModal.name === "characteristicsPopUp" ? "block" : "hidden"
      }
    >
      <PopUpTitle>{t("homePage.catalog.generalCharacteristics")}</PopUpTitle>
      <CharacteristicsList characteristics={characteristics} />
    </div>
  );
}
