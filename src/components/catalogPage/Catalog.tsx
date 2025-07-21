"use client";
import { CategoryItem } from "@/types/categoryItem";
import CatalogFilter from "./catalogFilter/CatalogFilter";
import CatalogSlider from "./CatalogSlider";
import { ProductItem } from "@/types/productItem";
import { useSearchParams, useRouter } from "next/navigation";
import { FiltersState } from "./catalogFilter/CatalogFilter";

interface CatalogProps {
  currentCategories: CategoryItem[];
  allCategories: CategoryItem[];
  shownOnAddons: ProductItem[];
  categoryArray: string[];
}

export default function Catalog({
  currentCategories,
  allCategories,
  shownOnAddons,
  categoryArray,
}: CatalogProps) {
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
      />
      <CatalogSlider
        currentCategories={currentCategories}
        shownOnAddons={shownOnAddons}
        categoryArray={categoryArray}
      />
    </section>
  );
}
