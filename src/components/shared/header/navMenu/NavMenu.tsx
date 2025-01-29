"use client";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction } from "react";
import MenuLink from "./MenuLink";

interface NavMenuProps {
  setIsHeaderMenuOpened?: Dispatch<SetStateAction<boolean>> | undefined;
}

export default function NavMenu({ setIsHeaderMenuOpened }: NavMenuProps) {
  const t = useTranslations();

  const menuList = [
    { title: t("header.navMenu.home"), path: "" },
    { title: t("header.navMenu.catalog"), path: "#catalog" },
    { title: t("header.navMenu.delivery"), path: "#delivery" },
    { title: t("header.navMenu.about"), path: "about" },
    { title: t("header.navMenu.faq"), path: "#faq" },
  ];

  return (
    <nav className={`relative flex justify-center items-center max-w-[1920px]`}>
      <ul className={`flex flex-col laptop:flex-row gap-8 laptop:gap-16`}>
        {menuList.map((menuItem, idx) => (
          <MenuLink
            key={idx}
            menuItem={menuItem}
            setIsHeaderMenuOpened={setIsHeaderMenuOpened}
          />
        ))}
      </ul>
    </nav>
  );
}
