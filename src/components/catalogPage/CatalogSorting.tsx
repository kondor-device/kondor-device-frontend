"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function CatalogSorting() {
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

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(initialSelected);

  const handleOptionClick = (option: { value: string; title: string }) => {
    setSelected(option);
    setIsOpen(false);

    const newParams = new URLSearchParams(Array.from(searchParams.entries()));
    newParams.set("sort", option.value);
    newParams.set("page", "1");
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!searchParams.get("sort")) {
      const newParams = new URLSearchParams(Array.from(searchParams.entries()));
      newParams.set("sort", "rating");
      newParams.set("page", "1");
      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [router, searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative w-full max-w-[250px] xl:max-w-[405px]"
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group cursor-pointer flex items-center gap-x-2 xl:gap-x-4 w-full h-8 xl:h-11 px-3 xl:px-7 rounded-full border border-orange-light text-[10px] xl:text-[16px] font-medium text-dark bg-white xl:hover:brightness-110 focus-visible:brightness-110 transition duration-300 ease-in-out"
      >
        <p>{t("sort")}</p>
        <div className="size-2 rounded-full bg-dark shrink-0" />
        <span className="truncate text-[10px] xl:text-[16px] font-semibold text-orange xl:group-hover:brightness-110 group-focus-visible:brightness-110 transition duration-300 ease-in-out">
          {selected.title}
        </span>
      </button>

      <div
        className={`${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } absolute right-0 w-[175px] xl:w-[263px] mt-2 bg-white rounded-[16px] 
            shadow-social overflow-hidden text-[10px] xl:text-[16px] font-semibold transition duration-500 ease-in-out`}
      >
        {sortingOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option)}
            className="cursor-pointer w-full text-left px-4 py-1.5 xl:hover:bg-orange-light xl:hover:text-white text-dark transition duration-100 ease-in-out"
          >
            {option.title}
          </button>
        ))}
      </div>
    </div>
  );
}
