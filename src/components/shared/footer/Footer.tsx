"use client";
import LogoLink from "../logoLink/LogoLink";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Important from "./Important";
import Details from "./Details";
import Contacts from "./Contacts";

export default function Footer() {
  const t = useTranslations();

  const pathname = usePathname();

  const isProductPage = /^\/catalog\/[^\/]+$/.test(pathname);

  return (
    <footer className={isProductPage ? "pb-[90px] tabxl:pb-0" : ""}>
      <div className="container max-w-[1920px] flex flex-col tab:flex-row tab:justify-between items-start gap-y-[25px] pt-5 pb-5 laptop:pb-10">
        <div>
          <LogoLink className="w-[152px] laptop:w-[222px]" />
          <p className="mt-[10px] text-12med laptop:text-18med">
            {t("footer.rights")}
          </p>
        </div>
        <Important />
        <Details />
        <Contacts />
      </div>
    </footer>
  );
}
