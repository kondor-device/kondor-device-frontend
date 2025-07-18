"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CategoryItem } from "@/types/categoryItem";
import AvailabilityFilter from "./AvailabilityFilter";
import PriceFilter from "./PriceFilter";
import TypeFilter from "./TypeFilter";
import Button from "@/components/shared/buttons/Button";
import { useTranslations } from "next-intl";

interface CatalogFilterProps {
  allCategories: CategoryItem[];
}

export interface FiltersState {
  type: { title: string; category: string }[];
  availability: { title: string; value: string }[];
  priceFrom?: number;
  priceTo?: number;
}

export default function CatalogFilter({ allCategories }: CatalogFilterProps) {
  const searchParams = useSearchParams();

  const router = useRouter();

  const pathname = usePathname();

  const t = useTranslations("catalogPage");

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

    // Якщо відсутній параметр — встановлюємо "in-stock"
    if (!availabilityParam) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("availability", "in-stock");

      router.replace(`${pathname}?${newParams.toString()}`);
    }

    // Обробка type
    const type = typeParam
      ? typeParam.split(",").map((slug) => {
          const found = allCategories.find((cat) => cat.slug === slug);
          return {
            category: slug,
            title: found?.name || slug,
          };
        })
      : [];

    const availability = availabilityParam
      ? availabilityParam.split(",").map((value) => ({
          value,
          title:
            value === "in-stock"
              ? t("inStock")
              : value === "pre-order"
              ? t("pre-order")
              : value,
        }))
      : [];

    setFilters({
      type,
      availability,
      priceFrom: priceFromParam ? Number(priceFromParam) : undefined,
      priceTo: priceToParam ? Number(priceToParam) : undefined,
    });
  }, [searchParams, allCategories, t, router, pathname]);

  console.log(filters);

  return (
    <div className="hidden tabxl:block shrink-0 tabxl:w-[311px] tabxl:h-fit py-5 px-6 rounded-[12px] shadow-catalogFilter bg-white">
      <TypeFilter
        allCategories={allCategories}
        value={filters.type}
        onChange={(type) => setFilters((f) => ({ ...f, type }))}
      />
      <AvailabilityFilter
        value={filters.availability}
        onChange={(availability) => setFilters((f) => ({ ...f, availability }))}
      />
      <PriceFilter />
      <Button className="w-full h-[54px]">{t("apply")}</Button>
    </div>
  );
}
