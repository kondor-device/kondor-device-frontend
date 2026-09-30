"use client";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import MenuLink from "./MenuLink";
import IconChevron from "../../icons/IconChevron";
import CatalogDropdown from "../catalogMenu/CatalogDropdown";
import { CategoryItem } from "@/types/categoryItem";

interface NavMenuProps {
  categories: CategoryItem[];
}

export default function NavMenu({ categories }: NavMenuProps) {
  const t = useTranslations();
  const [isCatalogOpened, setIsCatalogOpened] = useState(false);

  const currentPath = usePathname().slice(1);

  const menuList = [
    { title: t("header.navMenu.home"), path: "" },
    { title: t("header.navMenu.catalog"), path: "catalog" },
    { title: t("header.navMenu.delivery"), path: "delivery" },
    { title: t("header.navMenu.about"), path: "about" },
    { title: t("header.navMenu.faq"), path: "#faq" },
  ];

  const getLinkClass = (path: string) =>
    currentPath === path ? "text-yellow text-18semi" : "text-18med";

  return (
    <nav className="relative flex justify-center items-center max-w-[1920px]">
      <ul className="flex flex-row items-center h-full gap-8 laptop:gap-16">
        {menuList.map((menuItem) =>
          menuItem.path === "catalog" ? (
            // li розтягнутий на всю висоту хедера, щоб курсор без розриву
            // дійшов з пункту меню до випадаючого списку.
            <li
              key={menuItem.path}
              className={`relative flex items-center h-full text-center ${getLinkClass(
                menuItem.path
              )}`}
              onMouseEnter={() => setIsCatalogOpened(true)}
              onMouseLeave={() => setIsCatalogOpened(false)}
              onFocus={() => setIsCatalogOpened(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setIsCatalogOpened(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsCatalogOpened(false);
              }}
            >
              <Link
                href={`/${menuItem.path}`}
                onClick={() => setIsCatalogOpened(false)}
                aria-haspopup="true"
                aria-expanded={isCatalogOpened}
                className="flex items-center gap-2 transition duration-300 ease-out active:text-yellow focus-visible:text-yellow
         laptop:hover:text-yellow outline-none"
              >
                {menuItem.title}
                <IconChevron
                  className={`w-3 h-2 transition-transform duration-300 ${
                    isCatalogOpened ? "rotate-180" : ""
                  }`}
                />
              </Link>
              <CatalogDropdown
                categories={categories}
                isOpened={isCatalogOpened}
                onNavigate={() => setIsCatalogOpened(false)}
              />
            </li>
          ) : (
            <MenuLink
              key={menuItem.path}
              menuItem={menuItem}
              className={getLinkClass(menuItem.path)}
            />
          )
        )}
      </ul>
    </nav>
  );
}
