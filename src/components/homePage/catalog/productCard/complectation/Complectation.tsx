"use client";
import React, { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import SecondaryButton from "@/components/shared/buttons/SecondaryButton";
import ComplectationPopUp from "./ComplectationPopUp";

interface ComplectationProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  complectation: [];
}

export default function Complectation({
  isPopUpShown,
  setIsPopUpShown,
  complectation,
}: ComplectationProps) {
  const t = useTranslations();

  return (
    <>
      <SecondaryButton onClick={() => setIsPopUpShown(true)}>
        {t("homePage.catalog.set")}
      </SecondaryButton>
      <ComplectationPopUp
        isPopUpShown={isPopUpShown}
        setIsPopUpShown={setIsPopUpShown}
        complectation={complectation}
      />
    </>
  );
}
