"use client";
import React, { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import CharacteristicsPopUp from "@/components/shared/pop-ups/CharacteristicsPopUp";
import SecondaryButton from "@/components/shared/buttons/SecondaryButton";

interface CharacteristicsProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function Characteristics({
  isPopUpShown,
  setIsPopUpShown,
}: CharacteristicsProps) {
  const t = useTranslations();

  return (
    <>
      <SecondaryButton onClick={() => setIsPopUpShown(true)}>
        {t("homePage.catalog.characteristics")}
      </SecondaryButton>
      <CharacteristicsPopUp
        isPopUpShown={isPopUpShown}
        setIsPopUpShown={setIsPopUpShown}
      />
    </>
  );
}
