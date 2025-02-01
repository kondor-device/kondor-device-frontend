"use client";

import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import Modal from "../../../../shared/modal/Modal";
import PopUpTitle from "../../../../shared/titles/PopUpTitle";

interface CharacteristicsPopUpProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  characteristics: [];
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
        <div className="flex flex-col gap-6">
          <PopUpTitle>
            {t("homePage.catalog.generalCharacteristics")}
          </PopUpTitle>
          <p className="text-center">тест</p>
        </div>
      </Modal>
    </>
  );
}
