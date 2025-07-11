import React, { Dispatch, SetStateAction } from "react";
import LogoLink from "../logoLink/LogoLink";
import SocialLinksList from "./socialLinks/SocialLinksList";
import NavMenu from "./navMenu/NavMenu";

interface HeaderDeskProps {
  setIsCatalogMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function HeaderDesk({
  setIsCatalogMenuOpened,
}: HeaderDeskProps) {
  return (
    <div className="hidden tabxl:block w-[100vw] bg-white">
      <div className="flex justify-between container w-full max-w-[1920px] h-[113px]">
        <LogoLink className="w-[203px]" />
        <NavMenu setIsCatalogMenuOpened={setIsCatalogMenuOpened} />
        <SocialLinksList />
      </div>
    </div>
  );
}
