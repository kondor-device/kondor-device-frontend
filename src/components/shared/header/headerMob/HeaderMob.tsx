"use client";

import React, { useState, Dispatch, SetStateAction } from "react";
import LogoLink from "@/components/shared/logoLink/LogoLink";
import BurgerMenu from "./burgerMenu/BurgerMenu";
import BurgerMenuButton from "./burgerMenu/BurgerMenuButton";

interface HeaderMobProps {
  setIsCatalogMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function HeaderMob({ setIsCatalogMenuOpened }: HeaderMobProps) {
  const [isHeaderMenuOpened, setIsHeaderMenuOpened] = useState(false);
  const toggleHeaderMenuOpen = () => setIsHeaderMenuOpened(!isHeaderMenuOpened);

  return (
    <div
      className={`relative tabxl:hidden w-full h-[82px] bg-white overflow-x-clip`}
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
      <BurgerMenu
        setIsCatalogMenuOpened={setIsCatalogMenuOpened}
        isHeaderMenuOpened={isHeaderMenuOpened}
        setIsHeaderMenuOpened={setIsHeaderMenuOpened}
      />
    </div>
  );
}
