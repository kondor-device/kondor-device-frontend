"use client";

import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import Modal from "../../../../shared/modal/Modal";
import PopUpTitle from "../../../../shared/titles/PopUpTitle";

interface CharacteristicsPopUpProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  complectation: [];
}

export default function ComplectationPopUp({
  isPopUpShown,
  setIsPopUpShown,
  complectation,
}: CharacteristicsPopUpProps) {
  const t = useTranslations();

  return (
    <>
      <Modal isPopUpShown={isPopUpShown} setIsPopUpShown={setIsPopUpShown}>
        <PopUpTitle>{t("homePage.catalog.set")}</PopUpTitle>
        <p className="text-center">тест</p>
      </Modal>
    </>
  );
}
