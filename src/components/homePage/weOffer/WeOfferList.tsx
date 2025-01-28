import React from "react";
import { useTranslations } from "next-intl";
import WeOfferItem from "./WeOfferItem";

export default function WeOfferList() {
  const t = useTranslations("homePage");

  const weOfferList = [
    {
      title: t("weOffer.warranty"),
      icon: "warranty",
    },
    { title: t("weOffer.freeDelivery"), icon: "freeDelivery" },
    { title: t("weOffer.securePayment"), icon: "securePayment" },
  ];
  return (
    <ul className="flex flex-col laptop:flex-row gap-x-6 gap-y-5 laptop:justify-between w-full">
      {weOfferList.map((weOffertItem, idx) => (
        <WeOfferItem key={idx} weOfferItem={weOffertItem} />
      ))}
    </ul>
  );
}
