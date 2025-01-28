import React from "react";
import FooterSubTitle from "./FooterSubTitle";
import { useTranslations } from "next-intl";
import FooterNavItem from "./FooterNavItem";

export default function Details() {
  const t = useTranslations();

  const detailsList = [
    { title: t("footer.details.list.policy"), path: "/policy" },
    { title: t("footer.details.list.warranty"), path: "/warranty" },
    { title: t("footer.details.list.faq"), path: "/#faq" },
  ];
  return (
    <div>
      <FooterSubTitle>{t("footer.details.title")}</FooterSubTitle>
      <ul className="flex flex-col gap-y-[10px] laptop:gap-y-[15px]">
        {detailsList.map((importantItem, idx) => (
          <FooterNavItem key={idx} navItem={importantItem} />
        ))}
      </ul>
    </div>
  );
}
