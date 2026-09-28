"use client";

import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

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
    { title: t("sortingOptions.default"), value: "default" },
    { title: t("sortingOptions.priceAscending"), value: "price-ascending" },
    { title: t("sortingOptions.priceDescending"), value: "price-descending" },
    { title: t("sortingOptions.discount"), value: "discount" },
    { title: t("sortingOptions.rating"), value: "rating" },
    { title: t("sortingOptions.nameAscending"), value: "name-ascending" },
    { title: t("sortingOptions.nameDescending"), value: "name-descending" },
  ];

  const initialSort = searchParams.get("sort") || "default";
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

  // Немає власного "заповнюючого" ефекту для ?sort= — раніше він тут був,
  // але одночасно з CatalogFilter (свій ефект для type/availability/price)
  // обидва компоненти на монтуванні викликали router.replace() від того
  // самого "застарілого" (порожнього) searchParams, і останній виклик
  // перезаписував параметри, які щойно додав інший — категорія на мить
  // зникала з URL і показувалось "немає товарів". Відсутність "sort" і так
  // трактується як "default" усюди, де URL читається (CatalogSlider), тож
  // дописувати його в URL непотрібно — досить самого select-стану нижче.
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
        className="relative z-20 group cursor-pointer flex items-center justify-between w-full h-8 xl:h-11 px-3 rounded-[8px] border border-fg text-[10px] xl:text-[16px] font-bold text-fg bg-surface xl:hover:brightness-110 focus-visible:brightness-110 transition duration-300 ease-in-out"
      >
        <div className="flex items-center gap-x-2">
          <p>{t("sort")}</p>
          <span className="truncate text-[10px] xl:text-[16px] font-medium">
            {selected.title}
          </span>
        </div>
        <Image
          src="/images/icons/arrow.svg"
          alt="arrow"
          width={14}
          height={8}
          className={`w-2 tabxl:w-3 h-auto ml-3 dark:invert transition duration-500 ease-in-out ${
            isOpenDropdown ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`${
          isOpenDropdown ? "opacity-100" : "opacity-0 pointer-events-none"
        } absolute z-10 top-[calc(100%-5px)] right-0 w-full px-3 bg-surface rounded-b-[8px] border-x border-r border-b border-fg
            shadow-catalogCard overflow-hidden text-[10px] xl:text-[16px] font-medium transition duration-500 ease-in-out`}
      >
        <div className="w-full h-1"></div>
        {sortingOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option)}
            className={`cursor-pointer w-full text-left px-4 py-2 [&:not(:last-child)]:border-b border-fg/30 xl:hover:text-yellow/50 text-fg transition duration-100 ease-in-out ${
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
