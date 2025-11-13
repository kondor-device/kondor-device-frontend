"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryItem } from "@/types/categoryItem";
import CatalogCard from "./CatalogCard";
import { ProductItem } from "@/types/productItem";
import EmptyCategory from "../homePage/catalog/EmptyCategory";
import Loader from "../shared/loader/Loader";
import SectionTitle from "../shared/titles/SectionTitle";
import { useTranslations } from "next-intl";

interface CatalogSliderProps {
  currentCategories: CategoryItem[];
  shownOnAddons: ProductItem[];
  isOpenDropdown: boolean;
  otherCategories: CategoryItem[];
}

export default function CatalogSlider({
  currentCategories,
  shownOnAddons,
  isOpenDropdown,
  otherCategories,
}: CatalogSliderProps) {
  const ITEMS_PER_PAGE = 12;

  const t = useTranslations("catalogPage");

  const searchParams = useSearchParams();

  const newItems = searchParams.get("new");
  const availability = searchParams.get("availability");
  const priceFrom = Number(searchParams.get("priceFrom"));
  const priceTo = Number(searchParams.get("priceTo"));
  const sort = searchParams.get("sort");

  const getFilteredAndSortedItems = (
    categories: CategoryItem[],
    availability: string | null,
    newItems: string | null,
    priceFrom: number,
    priceTo: number,
    sort: string | null
  ): ProductItem[] => {
    const filteredItems = categories
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

  const filteredOtherItems = useMemo(
    () =>
      getFilteredAndSortedItems(
        otherCategories, // <- зміна тут: передаємо масив категорій напряму
        availability,
        newItems,
        priceFrom,
        priceTo,
        sort
      ),
    [otherCategories, availability, newItems, priceFrom, priceTo, sort]
  );

  // --- Стан для основних товарів ---
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // --- Стан для інших товарів ---
  const [visibleCountOther, setVisibleCountOther] = useState(ITEMS_PER_PAGE);
  const [isLoadingMoreOther, setIsLoadingMoreOther] = useState(false);

  // Відображення секції з іншими товарами
  const showOtherCategorySection = visibleCount >= currentItems.length;

  // Скидаємо при зміні фільтрів
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    setVisibleCountOther(ITEMS_PER_PAGE);
    setIsLoadingMore(false);
    setIsLoadingMoreOther(false);
  }, [currentItems, filteredOtherItems]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (scrollTop + viewportHeight >= fullHeight - 200) {
      // Завантаження основних товарів
      if (!isLoadingMore && visibleCount < currentItems.length) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) =>
            Math.min(prev + ITEMS_PER_PAGE, currentItems.length)
          );
          setIsLoadingMore(false);
        }, 600);
        return; // пріоритет основним товарам
      }

      // Завантаження інших товарів, якщо основні повністю завантажені
      if (
        showOtherCategorySection &&
        !isLoadingMoreOther &&
        visibleCountOther < filteredOtherItems.length
      ) {
        setIsLoadingMoreOther(true);
        setTimeout(() => {
          setVisibleCountOther((prev) =>
            Math.min(prev + ITEMS_PER_PAGE, filteredOtherItems.length)
          );
          setIsLoadingMoreOther(false);
        }, 600);
      }
    }
  }, [
    isLoadingMore,
    visibleCount,
    currentItems.length,
    showOtherCategorySection,
    isLoadingMoreOther,
    visibleCountOther,
    filteredOtherItems.length,
  ]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      {!currentItems ? (
        <Loader />
      ) : currentItems.length > 0 ? (
        <>
          <div className={`${isOpenDropdown ? "pointer-events-none" : ""}`}>
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
          </div>

          {/* СЕКЦІЯ — Товари з інших категорій */}
          {showOtherCategorySection && filteredOtherItems.length > 0 && (
            <div className="pt-4 tabxl:pt-10 tabxl:mt-10 border-t border-dark">
              <SectionTitle className="mb-6">
                {t("otherCategories")}
              </SectionTitle>
              <div className="flex flex-wrap gap-x-3 gap-y-4 laptop:gap-x-6 laptop:gap-y-[30px]">
                {filteredOtherItems
                  .slice(0, visibleCountOther)
                  .map((item, idx) => (
                    <CatalogCard
                      key={item.id ?? idx}
                      product={item}
                      shownOnAddons={shownOnAddons}
                      className="w-[calc(50%-6px)] tab:w-[calc(33.33%-8px)] laptop:w-[calc(33.33%-16px)]"
                    />
                  ))}
              </div>

              {isLoadingMoreOther && (
                <div className="w-full flex justify-center pt-10">
                  <Loader className="h-[140px]" />
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <EmptyCategory className="mt-[80px] tabxl:mt-[160px]" />
      )}
    </>
  );
}
