import React from "react";
import LogoLink from "../logoLink/LogoLink";
import SocialLinksList from "./socialLinks/SocialLinksList";
import NavMenu from "./navMenu/NavMenu";

export default function HeaderDesk() {
  return (
    <div className="hidden tabxl:block w-[100vw] bg-white">
      <div className="flex justify-between container w-full max-w-[1920px] h-[113px]">
        <LogoLink className="w-[203px]" />
        <NavMenu />
        <SocialLinksList />
      </div>
    </div>
  );
}
