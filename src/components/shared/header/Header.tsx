"use client";
import { useState } from "react";
import HeaderDesk from "./HeaderDesk";
import HeaderMob from "./headerMob/HeaderMob";
import CatalogMenu from "./catalogMenu/CatalogMenu";
import Backdrop from "./catalogMenu/Backdrop";
import { CategoryItem } from "@/types/categoryItem";

interface HeaderProps {
  categories: CategoryItem[];
}

export default function Header({ categories }: HeaderProps) {
  const [isCatalogMenuOpened, setIsCatalogMenuOpened] = useState(false);

  return (
    <>
      <header className={`w-[100dvw] fixed z-[60] top-0 left-0"`}>
        <HeaderDesk setIsCatalogMenuOpened={setIsCatalogMenuOpened} />
        <HeaderMob
          setIsCatalogMenuOpened={setIsCatalogMenuOpened}
          categories={categories}
        />
      </header>
      <CatalogMenu
        categories={categories}
        isCatalogMenuOpened={isCatalogMenuOpened}
        setIsCatalogMenuOpened={setIsCatalogMenuOpened}
      />
      <Backdrop
        isVisible={isCatalogMenuOpened}
        onClick={() => setIsCatalogMenuOpened(false)}
        className="hidden tabxl:block"
      />
    </>
  );
}
