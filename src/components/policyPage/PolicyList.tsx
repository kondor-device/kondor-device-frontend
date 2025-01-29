import React from "react";
import PolicyItem from "./PolicyItem";
import { useTranslations } from "next-intl";

export default function PolicyList() {
  const t = useTranslations("policyPage");

  const policyList = [
    {
      title: t("list.partOne.title"),
      description: t("list.partOne.description"),
    },
    {
      title: t("list.partTwo.title"),
      description: t("list.partTwo.description"),
    },
    {
      title: t("list.partThree.title"),
      description: t("list.partThree.description"),
    },
    {
      title: t("list.partFour.title"),
      description: t("list.partFour.description"),
    },
  ];
  return (
    <ul className="flex flex-col gap-y-5 w-full pb-[30px] laptop:pb-[50px]">
      {policyList.map((policyItem, idx) => (
        <PolicyItem key={idx} policyItem={policyItem} />
      ))}
    </ul>
  );
}
