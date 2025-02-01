"use client";

import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import Modal from "../modal/Modal";
// import PopUpTitle from "../titles/PopUpTitle";

interface CharacteristicsPopUpProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function CharacteristicsPopUp({
  isPopUpShown,
  setIsPopUpShown,
}: CharacteristicsPopUpProps) {
  const t = useTranslations();

  return (
    <>
      <Modal isPopUpShown={isPopUpShown} setIsPopUpShown={setIsPopUpShown}>
        <div className="flex flex-col gap-6">
          {/* <PopUpTitle>{t("title")}</PopUpTitle> */}
          <p className="text-center">тест</p>
        </div>
      </Modal>
    </>
  );
}
