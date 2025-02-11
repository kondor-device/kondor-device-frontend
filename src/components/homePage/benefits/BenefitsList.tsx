import React from "react";
import { useTranslations } from "next-intl";
import BenefitItem from "./BenefitItem";

export default function BenefitsList() {
  const t = useTranslations("homePage");

  const benefitsList = [
    {
      title: t("benefits.list.delivery.title"),
      description: t("benefits.list.delivery.description"),
      icon: "delivery",
    },
    {
      title: t("benefits.list.payment.title"),
      description: t("benefits.list.payment.description"),
      icon: "payment",
    },
    {
      title: t("benefits.list.warranty.title"),
      description: t("benefits.list.warranty.description"),
      icon: "warranty",
    },
    {
      title: t("benefits.list.bill.title"),
      description: t("benefits.list.bill.description"),
      icon: "bill",
    },
  ];
  return (
    <ul
      className="flex flex-row flex-wrap tabxl:flex-nowrap gap-x-2 mob:gap-x-[10px] laptop:gap-x-6 deskxl:gap-x-[30px] gap-y-[13px] justify-between w-full
    max-w-[555px] tabxl:max-w-full mx-auto"
    >
      {benefitsList.map((benefitItem, idx) => (
        <BenefitItem key={idx} benefitItem={benefitItem} idx={idx} />
      ))}
    </ul>
  );
}
