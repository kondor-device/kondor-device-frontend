import React from "react";
import LogoLink from "../logoLink/LogoLink";
import SocialLinksList from "./socialLinks/SocialLinksList";
import NavMenu from "./navMenu/NavMenu";

export default function HeaderDesk() {
  return (
    <div className="hidden laptop:block fixed z-10 w-[100vw] bg-white">
      <div className="flex justify-between container max-w-[1920px] h-[113px]">
        <LogoLink className="w-[203px]" />
        <NavMenu />
        <SocialLinksList />
      </div>
    </div>
  );
}
