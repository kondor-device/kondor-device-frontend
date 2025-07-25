"use client";

import React, { useState, Dispatch, SetStateAction } from "react";
import LogoLink from "@/components/shared/logoLink/LogoLink";
import BurgerMenuButton from "./burgerMenu/BurgerMenuButton";
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
      className={`relative tabxl:hidden w-full h-[82px] bg-white overflow-x-clip rounded-b-[12px] shadow-catalogCard`}
    >
      <div className="container flex items-center justify-between max-w-[1920px] h-full">
        <LogoLink
          className="relative z-[60] w-[152px]"
          setIsHeaderMenuOpened={setIsHeaderMenuOpened}
        />
        <BurgerMenuButton
          isHeaderMenuOpened={isHeaderMenuOpened}
          toggleHeaderMenuOpen={toggleHeaderMenuOpen}
          setIsCatalogMenuOpened={setIsCatalogMenuOpened}
        />
      </div>
      <CatalogMenu
        categories={categories}
        isCatalogMenuOpened={isHeaderMenuOpened}
        setIsCatalogMenuOpened={setIsHeaderMenuOpened}
      />
    </div>
  );
}
