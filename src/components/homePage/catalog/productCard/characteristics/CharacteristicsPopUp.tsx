"use client";

import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import Modal from "../../../../shared/modal/Modal";
import PopUpTitle from "../../../../shared/titles/PopUpTitle";
import CharacteristicsList from "./CharacteristicsList";
import { Characteristic } from "@/types/productItem";

interface CharacteristicsPopUpProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  characteristics: Characteristic[];
}

export default function CharacteristicsPopUp({
  isPopUpShown,
  setIsPopUpShown,
  characteristics,
}: CharacteristicsPopUpProps) {
  const t = useTranslations();

  return (
    <>
      <Modal isPopUpShown={isPopUpShown} setIsPopUpShown={setIsPopUpShown}>
        <PopUpTitle>{t("homePage.catalog.generalCharacteristics")}</PopUpTitle>
        <CharacteristicsList characteristics={characteristics} />
      </Modal>
    </>
  );
}
