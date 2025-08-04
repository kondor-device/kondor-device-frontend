"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryItem } from "@/types/categoryItem";
import CatalogCard from "./CatalogCard";
import { ProductItem } from "@/types/productItem";
import EmptyCategory from "../homePage/catalog/EmptyCategory";
import Loader from "../shared/loader/Loader";

interface CatalogSliderProps {
  currentCategories: CategoryItem[];
  shownOnAddons: ProductItem[];
  isOpenDropdown: boolean;
}

export default function CatalogSlider({
  currentCategories,
  shownOnAddons,
  isOpenDropdown,
}: CatalogSliderProps) {
  const ITEMS_PER_PAGE = 12;

  const searchParams = useSearchParams();

  const newItems = searchParams.get("new");
  const availability = searchParams.get("availability");
  const priceFrom = Number(searchParams.get("priceFrom"));
  const priceTo = Number(searchParams.get("priceTo"));
  const sort = searchParams.get("sort");

  const getFilteredAndSortedItems = (
    currentCategories: CategoryItem[],
    availability: string | null,
    newItems: string | null,
    priceFrom: number,
    priceTo: number,
    sort: string | null
  ): ProductItem[] => {
    const filteredItems = currentCategories
      .flatMap((category) => category.items)
      .filter((item) => {
        if (item.showonmain === true) return false;
        if (availability === "in-stock" && item.preorder === true) return false;
        if (availability === "pre-order" && item.preorder !== true)
          return false;
        if (newItems === "true" && item.newItem !== true) return false;
        const actualPrice = item.priceDiscount ?? item.price;
        if (!isNaN(priceFrom) && actualPrice < priceFrom) return false;
        if (!isNaN(priceTo) && actualPrice > priceTo) return false;
        return true;
      });

    if (!sort || sort === "default") return filteredItems;

    const getModelName = (fullName: string) => {
      const parts = fullName.trim().split(/\s+/);
      return parts.slice(1).join(" ").toLowerCase();
    };

    return filteredItems.sort((a, b) => {
      const priceA = a.priceDiscount ?? a.price;
      const priceB = b.priceDiscount ?? b.price;
      switch (sort) {
        case "price-ascending":
          return priceA - priceB;
        case "price-descending":
          return priceB - priceA;
        case "discount":
          return (
            ((b.price - (b.priceDiscount ?? b.price)) / b.price) * 100 -
            ((a.price - (a.priceDiscount ?? a.price)) / a.price) * 100
          );
        case "name-ascending":
          return getModelName(a.name).localeCompare(getModelName(b.name));
        case "name-descending":
          return getModelName(b.name).localeCompare(getModelName(a.name));
        default:
          return 0;
      }
    });
  };

  const currentItems = useMemo(
    () =>
      getFilteredAndSortedItems(
        currentCategories,
        availability,
        newItems,
        priceFrom,
        priceTo,
        sort
      ),
    [currentCategories, availability, newItems, priceFrom, priceTo, sort]
  );

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Скидаємо при зміні фільтрів
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [currentItems]);

  // Функція обробки скролу
  const handleScroll = useCallback(() => {
    if (isLoadingMore) return;
    if (visibleCount >= currentItems.length) return;

    // Визначаємо висоту видимої частини та скільки докрутили
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    // Якщо докрутили до 200px від низу
    if (scrollTop + viewportHeight >= fullHeight - 200) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((prev) =>
          Math.min(prev + ITEMS_PER_PAGE, currentItems.length)
        );
        setIsLoadingMore(false);
      }, 600);
    }
  }, [isLoadingMore, visibleCount, currentItems.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      {!currentItems ? (
        <Loader />
      ) : currentItems.length > 0 ? (
        <ul className={`${isOpenDropdown ? "pointer-events-none" : ""}`}>
          <div className="flex flex-wrap gap-x-3 gap-y-4 laptop:gap-x-6 laptop:gap-y-[30px]">
            {currentItems.slice(0, visibleCount).map((item, idx) => (
              <CatalogCard
                key={item.id ?? idx}
                product={item}
                shownOnAddons={shownOnAddons}
                className="w-[calc(50%-6px)] tab:w-[calc(33.33%-8px)] laptop:w-[calc(33.33%-16px)]"
              />
            ))}
          </div>

          {isLoadingMore && (
            <div className="w-full flex justify-center pt-10">
              <Loader className="h-[140px]" />
            </div>
          )}
        </ul>
      ) : (
        <EmptyCategory className="mt-[80px] tabxl:mt-[160px]" />
      )}
    </>
  );
}
