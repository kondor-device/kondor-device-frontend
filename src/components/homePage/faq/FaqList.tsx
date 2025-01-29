import React from "react";
import { useTranslations } from "next-intl";
import FaqItem from "./FaqItem";

export default function FaqList() {
  const t = useTranslations("homePage");

  const stagesList = [
    {
      title: t("faq.list.first.title"),
      description: t("faq.list.first.answer"),
    },
    {
      title: t("faq.list.second.title"),
      description: t("faq.list.second.answer"),
    },
    {
      title: t("faq.list.third.title"),
      description: t("faq.list.third.answer"),
    },
  ];

  return (
    <ul className="flex flex-col gap-y-[9px] laptop:gap-y-6 max-w-[545px] laptop:max-w-[950px] mx-auto">
      {stagesList.map((faqItem, idx) => (
        <FaqItem key={idx} faqItem={faqItem} />
      ))}
    </ul>
  );
}
