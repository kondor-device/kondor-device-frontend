"use client";

import { useState } from "react";
import Image from "next/image";
import { CategoryItem } from "@/types/categoryItem";
import CatalogFilter from "./catalogFilter/CatalogFilter";
import { ProductItem } from "@/types/productItem";
import { useSearchParams, useRouter } from "next/navigation";
import { FiltersState } from "./catalogFilter/CatalogFilter";
import CatalogSorting from "./CatalogSorting";
import CatalogFiltersModal from "./CatalogFilterModal";
import Backdrop from "../shared/header/catalogMenu/Backdrop";
import CatalogSlider from "./CatalogSlider";

interface CatalogProps {
  currentCategories: CategoryItem[];
  allCategories: CategoryItem[];
  shownOnAddons: ProductItem[];
  /** Set on /catalog/[category]: the filter defaults to this single category
   * instead of every category (as it does on the shared /catalog). */
  defaultCategorySlug?: string;
}

export default function Catalog({
  currentCategories,
  allCategories,
  shownOnAddons,
  defaultCategorySlug,
}: CatalogProps) {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Застосовані (не чорнові — ті лишаються локальним станом усередині
  // CatalogFilter, аж до кліку "Застосувати") фільтри тримаємо тут, а не
  // чекаємо на них через router.push. `allCategories` вже містить повні
  // дані (з усіма товарами) для кожної категорії, тож "застосувати" вибір
  // категорій/наявності/ціни можна миттєво, локально — без повторного
  // походу на Sanity, який раніше й давав відчутну затримку перед тим, як
  // список товарів оновлювався.
  const [appliedType, setAppliedType] = useState<string[]>(() =>
    currentCategories.map((cat) => cat.slug),
  );
  const [appliedAvailability, setAppliedAvailability] = useState<string[]>(
    () => {
      const raw = searchParams.get("availability");
      return raw ? raw.split(",") : ["in-stock", "pre-order", "out-of-stock"];
    },
  );
  const [appliedPriceFrom, setAppliedPriceFrom] = useState<
    number | undefined
  >(() => {
    const raw = searchParams.get("priceFrom");
    return raw ? Number(raw) : undefined;
  });
  const [appliedPriceTo, setAppliedPriceTo] = useState<number | undefined>(
    () => {
      const raw = searchParams.get("priceTo");
      return raw ? Number(raw) : undefined;
    },
  );
  const [appliedNew, setAppliedNew] = useState(
    () => searchParams.get("new") === "true",
  );

  const handleApplyFilters = (filters: FiltersState) => {
    setAppliedType(filters.type.map((item) => item.category));
    setAppliedAvailability(filters.availability.map((item) => item.value));
    setAppliedPriceFrom(filters.priceFrom);
    setAppliedPriceTo(filters.priceTo);
    setAppliedNew(!!filters.newValue);

    // URL синхронізуємо у фоні — лише для посилань/закладок і сумісності з
    // серверними дефолтами при прямому заході; на видиме оновлення списку
    // товарів (стан вище) це більше не впливає.
    const params = new URLSearchParams(searchParams.toString());

    if (filters.type && filters.type.length > 0) {
      const categories = filters.type.map((item) => item.category);
      params.set("type", categories.join(","));
    } else {
      params.delete("type");
    }

    if (filters.availability && filters.availability.length > 0) {
      const availability = filters.availability.map((item) => item.value);
      params.set("availability", availability.join(","));
    } else {
      params.delete("availability");
    }

    if (filters.priceFrom !== undefined && filters.priceFrom !== null) {
      params.set("priceFrom", String(filters.priceFrom));
    } else {
      params.delete("priceFrom");
    }

    if (filters.priceTo !== undefined && filters.priceTo !== null) {
      params.set("priceTo", String(filters.priceTo));
    } else {
      params.delete("priceTo");
    }

    if (filters.newValue) {
      params.set("new", "true");
    } else {
      params.delete("new");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Список категорій, чиї товари зараз показуємо, рахуємо з allCategories
  // (уже повністю завантажені) за застосованими слагами — а не з
  // currentCategories (серверного пропу, актуального лише на момент
  // початкового заходу на сторінку).
  const appliedTypeSet = new Set(appliedType);
  const resolvedCurrentCategories: CategoryItem[] = allCategories.filter(
    (category) => appliedTypeSet.has(category.slug),
  );
  const otherCategories: CategoryItem[] = allCategories.filter(
    (category) => !appliedTypeSet.has(category.slug),
  );


  return (
    <section className="flex gap-4 laptop:gap-[30px] container max-w-[1920px] mt-6 pb-8 laptop:pb-[100px]">
      <CatalogFilter
        allCategories={allCategories}
        handleApplyFilters={handleApplyFilters}
        className="hidden tabxl:block"
        defaultCategorySlug={defaultCategorySlug}
      />
      <div className="flex flex-col w-full tabxl:w-[calc(100%-311px-16px)] laptop:w-[calc(100%-311px-30px)] gap-y-4 tabxl:gap-y-[30px]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpenFilter(true)}
            className="tabxl:hidden cursor-pointer outline-none"
          >
            <Image
              src="/images/icons/filter.svg"
              alt="filter icon"
              width={32}
              height={32}
            />
          </button>
          <CatalogSorting
            isOpenDropdown={isOpenDropdown}
            setIsOpenDropdown={setIsOpenDropdown}
          />
        </div>
        <CatalogSlider
          currentCategories={resolvedCurrentCategories}
          shownOnAddons={shownOnAddons}
          isOpenDropdown={isOpenDropdown}
          otherCategories={otherCategories}
          availability={appliedAvailability}
          priceFrom={appliedPriceFrom}
          priceTo={appliedPriceTo}
          newValue={appliedNew}
        />
      </div>
      <CatalogFiltersModal
        allCategories={allCategories}
        handleApplyFilters={handleApplyFilters}
        isOpen={isOpenFilter}
        onClose={() => setIsOpenFilter(false)}
        defaultCategorySlug={defaultCategorySlug}
      />
      <Backdrop
        isVisible={isOpenFilter}
        onClick={() => setIsOpenFilter(false)}
      />
    </section>
  );
}
