"use client";

import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import Modal from "../../../../shared/modal/Modal";
import PopUpTitle from "../../../../shared/titles/PopUpTitle";
import { ComplectItem } from "@/types/productItem";
import ComplectationList from "./ComplectationList";

interface CharacteristicsPopUpProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  complectation: ComplectItem[];
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
        <ComplectationList complectation={complectation} />
      </Modal>
    </>
  );
}
