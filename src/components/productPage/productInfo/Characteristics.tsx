"use client";

import { useTranslations } from "next-intl";
import PopUpTitle from "@/components/shared/titles/PopUpTitle";
import { Characteristic } from "@/types/productItem";
import CharacteristicItem from "./CharacteristicItem";

interface CharacteristicsPopUpProps {
  characteristics: Characteristic[];
}

export default function Characteristics({
  characteristics,
}: CharacteristicsPopUpProps) {
  const t = useTranslations();
  return (
    <div
      id="characteristics"
      className="relative -z-20 mb-4 tab:mb-8 p-5 desk:py-[56px] desk:px-[76px] scroll-mt-[82px] tabxl:scroll-mt-[113px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard"
    >
      <PopUpTitle>{t("homePage.catalog.generalCharacteristics")}</PopUpTitle>
      {characteristics.length > 0 ? (
        <ul className="flex flex-col gap-y-5 laptop:gap-y-[14px]">
          {characteristics.map((characteristicItem, idx) => (
            <CharacteristicItem
              key={idx}
              characteristicItem={characteristicItem}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
