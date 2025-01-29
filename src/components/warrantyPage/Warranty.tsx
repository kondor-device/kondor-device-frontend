import React from "react";
import PageTitle from "../shared/titles/PageTitle";
import { useTranslations } from "next-intl";
import WarrantyInfo from "./WarrantyInfo";
import Button from "../shared/buttons/Button";
import { TELEGRAM_URL } from "@/constants/constants";

export default function Warranty() {
  const t = useTranslations("");

  return (
    <>
      <PageTitle>{t("warrantyPage.title")}</PageTitle>
      <section className="container max-w-[1920px] py-5 laptop:py-[100px]">
        <WarrantyInfo />
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block w-fit mx-auto laptop:mx-0"
        >
          <Button>
            <p>
              {t("buttons.haveQuestions")}
              <span className="text-14med laptop:text-18reg">
                {t("buttons.telegram")}
              </span>
            </p>
          </Button>
        </a>
      </section>
    </>
  );
}
