import React from "react";
import LogoLink from "../logoLink/LogoLink";
import { useTranslations } from "next-intl";
import Important from "./Important";
import Details from "./Details";
import Contacts from "./Contacts";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer>
      <div className="container max-w-[1920px] flex flex-col laptop:flex-row justify-between items-start gap-y-[25px] py-5">
        <div>
          <LogoLink className="w-[152px] laptop:w-[222px]" />
          <p className="text-12med laptop:text-18med">{t("footer.rights")}</p>
        </div>
        <Important />
        <Details />
        <Contacts />
      </div>
    </footer>
  );
}
