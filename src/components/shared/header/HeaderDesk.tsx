import React from "react";
import LogoLink from "../logoLink/LogoLink";
import SocialLinksList from "./socialLinks/SocialLinksList";
import NavMenu from "./navMenu/NavMenu";
import ThemeToggle from "../themeToggle/ThemeToggle";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";
import { CategoryItem } from "@/types/categoryItem";

interface HeaderDeskProps {
  categories: CategoryItem[];
}

export default function HeaderDesk({ categories }: HeaderDeskProps) {
  return (
    <div className="hidden tabxl:block w-full bg-page">
      <div className="flex justify-between container w-full max-w-[1920px] h-[113px]">
        <LogoLink className="w-[203px]" />
        <NavMenu categories={categories} />
        <div className="flex items-center gap-6 laptop:gap-8">
          <ThemeToggle />
          <LanguageSwitcher />
          <SocialLinksList />
        </div>
      </div>
    </div>
  );
}
