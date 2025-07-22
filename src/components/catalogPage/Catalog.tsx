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
import dynamic from "next/dynamic";
import Loader from "../shared/loader/Loader";

const CatalogSlider = dynamic(() => import("./CatalogSlider"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[700px] w-full">
      <Loader />
    </div>
  ),
});

interface CatalogProps {
  currentCategories: CategoryItem[];
  allCategories: CategoryItem[];
  shownOnAddons: ProductItem[];
}

export default function Catalog({
  currentCategories,
  allCategories,
  shownOnAddons,
}: CatalogProps) {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const searchParams = useSearchParams();

  const router = useRouter();

  const handleApplyFilters = (filters: FiltersState) => {
    const params = new URLSearchParams(searchParams.toString());

    // Типи
    if (filters.type && filters.type.length > 0) {
      const categories = filters.type.map((item) => item.category);
      params.set("type", categories.join(","));
    } else {
      params.delete("type");
    }

    // Наявність
    if (filters.availability && filters.availability.length > 0) {
      const availability = filters.availability.map((item) => item.value);
      params.set("availability", availability.join(","));
    } else {
      params.delete("availability");
    }

    // Ціна
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

    // Новинки
    if (filters.newValue) {
      params.set("new", "true");
    } else {
      params.delete("new");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="flex gap-4 laptop:gap-[30px] container max-w-[1920px] mt-6 pb-8 laptop:pb-[100px]">
      <CatalogFilter
        allCategories={allCategories}
        handleApplyFilters={handleApplyFilters}
        className="hidden tabxl:block"
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
          currentCategories={currentCategories}
          shownOnAddons={shownOnAddons}
          isOpenDropdown={isOpenDropdown}
        />
      </div>
      <CatalogFiltersModal
        allCategories={allCategories}
        handleApplyFilters={handleApplyFilters}
        isOpen={isOpenFilter}
        onClose={() => setIsOpenFilter(false)}
      />
      <Backdrop
        isVisible={isOpenFilter}
        onClick={() => setIsOpenFilter(false)}
      />
    </section>
  );
}
