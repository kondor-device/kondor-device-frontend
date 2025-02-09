import React from "react";
import { useTranslations } from "next-intl";

export default function AboutInfo() {
  const t = useTranslations("aboutPage");

  return (
    <div className="flex flex-col gap-y-5 pb-[30px] laptop:pb-[50px] text-12reg laptop:text-24reg">
      <h2>{t("partOne")}</h2>
      <p>{t("partTwo")}</p>
      <p>{t("partThree")}</p>
      <p>{t("partFour")}</p>
      <p>{t("partFive")}</p>
      <p>{t("partSix")}</p>
    </div>
  );
}
