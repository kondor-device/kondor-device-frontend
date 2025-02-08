import React, { Dispatch, SetStateAction } from "react";
import PopUpTitle from "../titles/PopUpTitle";
import { useTranslations } from "next-intl";
import { useOrderStore } from "@/store/orderStore";

interface SuccessfulMessageProps {
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
}

export default function SuccessfulMessage({
  setIsNotificationShown,
}: SuccessfulMessageProps) {
  const t = useTranslations("");

  const { orderData } = useOrderStore();

  if (!orderData) {
    return null;
  }

  const { name, surname, phone, orderNumber, updatedCartItems, totalSum } =
    orderData;

  return (
    <div>
      <PopUpTitle>{t("notifications.successful.title")}</PopUpTitle>
      <p className="mt-5 mb-[10px] deskxl:mt-[25px] deskxl:mb-[15px] text-12reg laptop:text-18reg">
        {t("notifications.successful.description")}
      </p>
      <ul className="mb-5 deskxl:mb-10 text-12bold laptop:text-18bold">
        <li className="flex items-center py-[20px] laptop:py-[25px] border-b border-white border-opacity-[58%]">
          <p>{t("notifications.successful.order")}</p>
          <p className="ml-2 text-12med laptop:text-18med text-white">
            #{orderNumber}
          </p>
        </li>
        <li className="flex items-center py-[20px] deskxl:py-[25px] border-b border-white border-opacity-[58%]">
          <p>{t("notifications.successful.name")}</p>
          <p className="ml-2 text-12med laptop:text-18med text-white">{`${name} ${surname}`}</p>
        </li>
        <li className="flex items-center py-[20px] deskxl:py-[25px] border-b border-white border-opacity-[58%]">
          <p>{t("notifications.successful.phone")}</p>
          <p className="ml-2 text-12med laptop:text-18med text-white">
            {phone}
          </p>
        </li>
        <li className="flex items-center py-[20px] deskxl:py-[25px] border-b border-white border-opacity-[58%]">
          <p>{t("notifications.successful.total")}</p>
          <p className="ml-2 text-12med laptop:text-18med text-white">
            {totalSum}
            {t("homePage.catalog.hrn")}
          </p>
        </li>
        <li className="py-[20px] deskxl:py-[25px]">
          <p className="mb-2">{t("notifications.successful.products")}</p>
          <ul className="text-white">
            {updatedCartItems?.map((cartItem) => (
              <li
                key={cartItem.uniqueId}
                className="text-12semi laptop:text-18semi"
              >{`– ${cartItem.generalName} ${cartItem.name}, колір: ${cartItem.color}`}</li>
            ))}
          </ul>
        </li>
      </ul>
      <div className="p-5 rounded-[32px] bg-white">
        <p className="text-12reg">
          {t("notifications.successful.checkInformation")}
        </p>
        <div className="flex items-center text-12bold laptop:text-14bold py-[10px]">
          <p>{t("notifications.successful.phone")}</p>
          <p className="ml-2">{phone}</p>
        </div>
        <p className="text-12reg laptop:text-14reg">
          {t("notifications.successful.ifMistake")}
          <span
            onClick={() => setIsNotificationShown(false)}
            className="cursor-pointer text-12bold laptop:text-14bold text-yellow"
          >
            {t("notifications.successful.fillForm")}
          </span>
        </p>
      </div>
    </div>
  );
}
