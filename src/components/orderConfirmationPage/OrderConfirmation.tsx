"use client";
import React from "react";
import PopUpTitle from "../shared/titles/PopUpTitle";
import { useLocale, useTranslations } from "next-intl";
import { useOrderStore } from "@/store/orderStore";
import { Link } from "@/i18n/routing";

export default function OrderConfirmation() {
  const t = useTranslations("");
  const locale = useLocale();

  const { orderData } = useOrderStore();

  if (!orderData) {
    return null;
  }

  const { name, surname, phone, orderNumber, updatedCartItems, totalSum } =
    orderData;

  return (
    <section className="container max-w-[1920px] pt-5 pb-[30px] laptop:pb-20">
      <div
        className="min-w-[312px] max-w-[390px] laptop:max-w-[628px] w-[95.5%] tab:w-[628px] px-4 py-[30px] laptop:px-10 laptop:py-10 mx-auto 
      shadow-notificationMob laptop:shadow-notification rounded-[20px] laptop:rounded-[30px] bg-yellow"
      >
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
            <Link href="/" locale={locale}>
              <span className="cursor-pointer text-12bold laptop:text-14bold text-yellow">
                {t("notifications.successful.fillForm")}
              </span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
