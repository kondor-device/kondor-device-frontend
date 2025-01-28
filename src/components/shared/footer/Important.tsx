import React from "react";
import FooterSubTitle from "./FooterSubTitle";
import { useTranslations } from "next-intl";
import FooterNavItem from "./FooterNavItem";

export default function Important() {
  const t = useTranslations();

  const importantList = [
    { title: t("footer.important.list.home"), path: "/" },
    { title: t("footer.important.list.catalog"), path: "/#catalog" },
    { title: t("footer.important.list.delivery"), path: "/#delivery" },
  ];

  return (
    <div>
      <FooterSubTitle>{t("footer.important.title")}</FooterSubTitle>
      <ul className="flex flex-col gap-y-[10px] laptop:gap-y-[15px]">
        {importantList.map((importantItem, idx) => (
          <FooterNavItem key={idx} navItem={importantItem} />
        ))}
      </ul>
    </div>
  );
}
