"use client";
import { usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import HeaderDesk from "./HeaderDesk";
import HeaderMob from "./headerMob/HeaderMob";

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const isHomePage = pathname === `/${locale}` || pathname === "/";

  return (
    <header
      className={`w-[100dvw] ${!isHomePage ? "fixed z-50 top-0 left-0" : ""}`}
    >
      <HeaderDesk />
      <HeaderMob />
    </header>
  );
}
