import React from "react";
import LogoLink from "../logoLink/LogoLink";
import SocialLinksList from "./socialLinks/SocialLinksList";
import NavMenu from "./navMenu/NavMenu";

export default function HeaderDesk() {
  return (
    <div className="container hidden laptop:flex justify-between fixed z-10 w-[100vw] h-[113px]">
      <LogoLink />
      <NavMenu />
      <SocialLinksList />
    </div>
  );
}
