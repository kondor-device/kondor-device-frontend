"use client";

import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface CatalogSortingProps {
  isOpenDropdown: boolean;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}

export default function CatalogSorting({
  isOpenDropdown,
  setIsOpenDropdown,
}: CatalogSortingProps) {
  const t = useTranslations("catalogPage");
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortingOptions = [
    { title: t("sortingOptions.priceAscending"), value: "price-ascending" },
    { title: t("sortingOptions.priceDescending"), value: "price-descending" },
    { title: t("sortingOptions.discount"), value: "discount" },
    { title: t("sortingOptions.nameAscending"), value: "name-ascending" },
    { title: t("sortingOptions.nameDescending"), value: "name-descending" },
  ];

  const initialSort = searchParams.get("sort") || "price-ascending";
  const initialSelected =
    sortingOptions.find((opt) => opt.value === initialSort) ||
    sortingOptions[0];

  const [selected, setSelected] = useState(initialSelected);

  const handleOptionClick = (option: { value: string; title: string }) => {
    setSelected(option);
    setIsOpenDropdown(false);

    const newParams = new URLSearchParams(Array.from(searchParams.entries()));
    newParams.set("sort", option.value);
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!searchParams.get("sort")) {
      const newParams = new URLSearchParams(Array.from(searchParams.entries()));
      newParams.set("sort", "price-ascending");

      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [router, searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpenDropdown]);

  return (
    <div
      className="relative z-20 w-full max-w-[306px] xl:max-w-[386px] "
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpenDropdown((prev) => !prev)}
        className="relative z-20 group cursor-pointer flex items-center gap-x-2 w-full h-8 xl:h-11 px-3 xl:px-7 rounded-[8px] border border-dark text-[10px] xl:text-[16px] font-bold text-dark bg-white xl:hover:brightness-110 focus-visible:brightness-110 transition duration-300 ease-in-out"
      >
        <p>{t("sort")}</p>
        <span className="truncate text-[10px] xl:text-[16px] font-medium">
          {selected.title}
        </span>
      </button>

      <div
        className={`${
          isOpenDropdown ? "opacity-100" : "opacity-0 pointer-events-none"
        } absolute z-50 top-[calc(100%-4px)] right-0 w-full px-3 bg-white rounded-b-[8px] border-x border-r border-b border-dark
            shadow-catalogCard overflow-hidden text-[10px] xl:text-[16px] font-medium transition duration-500 ease-in-out`}
      >
        <div className="w-full h-1"></div>
        {sortingOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option)}
            className={`cursor-pointer w-full text-left px-4 py-2 [&:not(:last-child)]:border-b border-black/30 xl:hover:text-yellow/50 text-dark transition duration-100 ease-in-out ${
              option.value === selected.value ? "text-yellow" : ""
            }`}
          >
            {option.title}
          </button>
        ))}
      </div>
    </div>
  );
}
