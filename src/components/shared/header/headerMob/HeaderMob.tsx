"use client";

import React, { useState, Dispatch, SetStateAction } from "react";
import LogoLink from "@/components/shared/logoLink/LogoLink";
import BurgerMenuButton from "./burgerMenu/BurgerMenuButton";
import ThemeToggle from "../../themeToggle/ThemeToggle";
import LanguageSwitcher from "../../languageSwitcher/LanguageSwitcher";
import CatalogMenu from "../catalogMenu/CatalogMenu";
import { CategoryItem } from "@/types/categoryItem";

interface HeaderMobProps {
  setIsCatalogMenuOpened: Dispatch<SetStateAction<boolean>>;
  categories: CategoryItem[];
}

export default function HeaderMob({
  setIsCatalogMenuOpened,
  categories,
}: HeaderMobProps) {
  const [isHeaderMenuOpened, setIsHeaderMenuOpened] = useState(false);
  const toggleHeaderMenuOpen = () => setIsHeaderMenuOpened(!isHeaderMenuOpened);

  return (
    <div
      className={`relative tabxl:hidden w-full h-[60px] bg-page overflow-x-clip rounded-b-[12px] shadow-catalogCard`}
    >
      <div className="container flex items-center justify-between max-w-[1920px] h-full">
        <LogoLink
          className="relative z-[60] w-[152px]"
          setIsHeaderMenuOpened={setIsHeaderMenuOpened}
        />
        <div className="flex items-center">
          <ThemeToggle className="mr-[7px]" />
          <LanguageSwitcher className="mr-[6.5px]" />
          <BurgerMenuButton
            isHeaderMenuOpened={isHeaderMenuOpened}
            toggleHeaderMenuOpen={toggleHeaderMenuOpen}
            setIsCatalogMenuOpened={setIsCatalogMenuOpened}
          />
        </div>
      </div>
      <CatalogMenu
        categories={categories}
        isCatalogMenuOpened={isHeaderMenuOpened}
        setIsCatalogMenuOpened={setIsHeaderMenuOpened}
      />
    </div>
  );
}
