"use client";

import { useTranslations } from "next-intl";
import React from "react";
import PopUpTitle from "../../../../shared/titles/PopUpTitle";
import { ComplectItem } from "@/types/productItem";
import ComplectationList from "./ComplectationList";
import { useModalStore } from "@/store/modalStore";

interface CharacteristicsPopUpProps {
  complectation: ComplectItem[];
}

export default function Complectation({
  complectation,
}: CharacteristicsPopUpProps) {
  const t = useTranslations();
  const { activeModal } = useModalStore((state) => state);

  return (
    <div
      className={activeModal.name === "complectationPopUp" ? "block" : "hidden"}
    >
      <PopUpTitle>{t("homePage.catalog.set")}</PopUpTitle>
      <ComplectationList complectation={complectation} />
    </div>
  );
}
