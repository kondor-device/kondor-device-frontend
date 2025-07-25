import React, { Dispatch, SetStateAction } from "react";

import NavMenu from "../../navMenu/NavMenu";
import SocialLinksList from "../../socialLinks/SocialLinksList";

interface BurgerMenuMobTabProps {
  isHeaderMenuOpened: boolean;
  setIsCatalogMenuOpened: Dispatch<SetStateAction<boolean>>;
  setIsHeaderMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function BurgerMenu({
  isHeaderMenuOpened,
  setIsCatalogMenuOpened,
  setIsHeaderMenuOpened,
}: BurgerMenuMobTabProps) {
  return (
    <div
      className={`${
        isHeaderMenuOpened
          ? "translate-x-0 opacity-100 no-doc-scroll"
          : "translate-x-full opacity-0"
      } absolute top-0 right-0 z-50 w-[100vw] h-[100dvh] pt-[120px] pb-8 bg-white 
      transition duration-[600ms] overflow-y-auto`}
    >
      <div className="container flex flex-col items-center gap-y-20 max-w-full">
        <NavMenu
          setIsHeaderMenuOpened={setIsHeaderMenuOpened}
          setIsCatalogMenuOpened={setIsCatalogMenuOpened}
        />
        <SocialLinksList setIsHeaderMenuOpened={setIsHeaderMenuOpened} />
      </div>
    </div>
  );
}
