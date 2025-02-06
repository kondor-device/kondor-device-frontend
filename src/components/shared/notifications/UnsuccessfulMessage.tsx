import React from "react";
import PopUpTitle from "../titles/PopUpTitle";
import { useTranslations } from "next-intl";

export default function UnsuccessfulMessage() {
  const t = useTranslations("notifications.unsuccessful");

  return (
    <>
      <PopUpTitle>{t("title")}</PopUpTitle>
      <div className="flex justify-center items-center h-[120px]">
        <p className="w-[90%] my-auto text-center text-12bold laptop:text-18bold">
          {t("description")}
        </p>
      </div>
    </>
  );
}
