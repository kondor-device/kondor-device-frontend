import React from "react";
import { useTranslations } from "next-intl";
import StageItem from "./StageItem";

export default function StagesList() {
  const t = useTranslations("homePage");

  const stagesList = [
    {
      title: t("orderConditions.list.order.title"),
      description: t("orderConditions.list.order.description"),
    },
    {
      title: t("orderConditions.list.shipment.title"),
      description: t("orderConditions.list.shipment.description"),
    },
    {
      title: t("orderConditions.list.delivery.title"),
      description: t("orderConditions.list.delivery.description"),
    },
    {
      title: t("orderConditions.list.payment.title"),
      description: t("orderConditions.list.payment.description"),
    },
  ];

  return (
    <ul className="flex flex-col gap-x-[10px] gap-y-4 laptop:gap-y-[30px] max-w-[332px] laptop:max-w-[451px] desk:max-w-[678px]">
      {stagesList.map((stageItem, idx) => (
        <StageItem key={idx} stageItem={stageItem} />
      ))}
    </ul>
  );
}
