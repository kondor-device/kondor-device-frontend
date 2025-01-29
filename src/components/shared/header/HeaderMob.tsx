"use client";

import React, { useState } from "react";
import LogoLink from "@/components/shared/logoLink/LogoLink";
import BurgerMenu from "./BurgerMenu";
import BurgerMenuButton from "./BurgerMenuButton";

export default function HeaderMob() {
  const [isHeaderMenuOpened, setIsHeaderMenuOpened] = useState(false);
  const toggleHeaderMenuOpen = () => setIsHeaderMenuOpened(!isHeaderMenuOpened);

  return (
    <div className={`laptop:hidden fixed z-10 w-full h-[82px] bg-white`}>
      <div className="container flex items-center justify-between max-w-[1920px] h-full">
        <LogoLink className="w-[152px]" />
        <BurgerMenuButton
          isHeaderMenuOpened={isHeaderMenuOpened}
          toggleHeaderMenuOpen={toggleHeaderMenuOpen}
        />
      </div>
      <BurgerMenu
        isHeaderMenuOpened={isHeaderMenuOpened}
        setIsHeaderMenuOpened={setIsHeaderMenuOpened}
      />
    </div>
  );
}
