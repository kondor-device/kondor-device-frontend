import React, { Dispatch, SetStateAction } from "react";

import NavMenu from "./navMenu/NavMenu";
import SocialLinksList from "./socialLinks/SocialLinksList";

interface BurgerMenuMobTabProps {
  isHeaderMenuOpened: boolean;
  setIsHeaderMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function BurgerMenu({
  isHeaderMenuOpened,
  setIsHeaderMenuOpened,
}: BurgerMenuMobTabProps) {
  return (
    <div
      className={`${
        isHeaderMenuOpened
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      } absolute top-0 right-0 z-50 w-[100vw] h-[100dvh] tab:min-w-[360px] tab:max-h-[666px] tab:w-[40%] bg-beige 
      transition duration-[600ms] overflow-y-auto`}
    >
      <div className="container flex flex-col items-center max-w-full">
        <NavMenu setIsHeaderMenuOpened={setIsHeaderMenuOpened} />
        <SocialLinksList />
      </div>
    </div>
  );
}
