"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryItem } from "@/types/categoryItem";
import AvailabilityFilter from "./AvailabilityFilter";
import PriceFilter from "./PriceFilter";

import TypeFilter from "./TypeFilter";

interface CatalogFilterProps {
  allCategories: CategoryItem[];
}

export interface FiltersState {
  type: { title: string; category: string }[];
  availability: string[];
  priceFrom?: number;
  priceTo?: number;
}

export default function CatalogFilter({ allCategories }: CatalogFilterProps) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FiltersState>({
    type: [],
    availability: [],
  });

  useEffect(() => {
    if (!searchParams) return;

    const typeParam = searchParams.get("categories");
    const availabilityParam = searchParams.get("availability");
    const priceFromParam = searchParams.get("priceFrom");
    const priceToParam = searchParams.get("priceTo");

    const type = typeParam
      ? typeParam.split(",").map((slug) => {
          const found = allCategories.find((cat) => cat.slug === slug);
          return {
            category: slug,
            title: found?.name || slug,
          };
        })
      : [];

    setFilters({
      type,
      availability: availabilityParam ? availabilityParam.split(",") : [],
      priceFrom: priceFromParam ? Number(priceFromParam) : undefined,
      priceTo: priceToParam ? Number(priceToParam) : undefined,
    });
  }, [searchParams, allCategories]);

  return (
    <div className="hidden tabxl:block shrink-0 tabxl:w-[311px] tabxl:h-auto py-4 px-6 rounded-[12px] shadow-catalogFilter bg-white">
      <TypeFilter
        allCategories={allCategories}
        value={filters.type}
        onChange={(type) => setFilters((f) => ({ ...f, type }))}
      />
      <AvailabilityFilter />
      <PriceFilter />
    </div>
  );
}
