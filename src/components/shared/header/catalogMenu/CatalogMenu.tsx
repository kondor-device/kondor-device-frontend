import React, { Dispatch, SetStateAction } from "react";
import IconButton from "../../buttons/IconButton";
import IconClose from "../../icons/IconCLose";
import { useTranslations } from "next-intl";
import { CategoryItem } from "@/types/categoryItem";
import CatalogList from "./CatalogList";
import { getCatalogList } from "./getCatalogList";

interface CatalogMenuMobTabProps {
  categories: CategoryItem[];
  isCatalogMenuOpened: boolean;
  setIsCatalogMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function CatalogMenu({
  categories,
  isCatalogMenuOpened,
  setIsCatalogMenuOpened,
}: CatalogMenuMobTabProps) {
  const t = useTranslations("header.catalogMenu");

  const catalogList = getCatalogList(categories, {
    all: t("all"),
    new: t("new"),
  });

  return (
    <div
      className={`${
        isCatalogMenuOpened
          ? "translate-x-0 opacity-100 no-doc-scroll"
          : "-translate-x-full opacity-0"
      } fixed top-[60px] tabxl:top-0 left-0 z-[70] w-[100vw] tabxl:w-[400px] h-[calc(100dvh-60px)] tabxl:h-[100dvh] bg-surface dark:bg-page tabxl:rounded-r-[32px]
      transition duration-[600ms] overflow-hidden flex flex-col`}
    >

      <div
        className="flex-1 relative px-5 pt-3 tabxl:pt-[45px] pb-[45px] tabxl:pb-[122px] overflow-y-auto scrollbar 
      scrollbar-w-[2px] tabxl:scrollbar-w-[4px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-yellow 
      scrollbar-track-transparent"
      >
        <div className="hidden tabxl:flex justify-between items-center mb-[43px] tabxl:mb-12">
          <h2 className="ml-5 text-24bold text-dark">{t("title")}</h2>{" "}
          <IconButton
            handleClick={() => setIsCatalogMenuOpened(false)}
            className="mr-5 enabled:active:scale-95 enabled:active:text-yellow laptop:enabled:hover:text-yellow enabled:focus-visible:text-yellow transition duration-300 ease-out"
          >
            <IconClose className="size-full rotate-45" />
          </IconButton>
        </div>
        <CatalogList
          catalogList={catalogList}
          setIsCatalogMenuOpened={setIsCatalogMenuOpened}
        />
      </div>
    </div>
  );
}
