"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import { CategoryItem } from "@/types/categoryItem";
import AvailabilityFilter from "./AvailabilityFilter";
import PriceFilter from "./PriceFilter";
import TypeFilter from "./TypeFilter";
import Button from "@/components/shared/buttons/Button";
import { useTranslations } from "next-intl";

export interface FiltersState {
  type: { title: string; category: string }[];
  newValue?: boolean;
  availability: { title: string; value: string }[];
  priceFrom?: number;
  priceTo?: number;
}

interface CatalogFilterProps {
  allCategories: CategoryItem[];
  handleApplyFilters: (filters: FiltersState) => void;
  className?: string;
  isOpenModal?: boolean;
  closeModal?: () => void;
  /** On a category's own page (/catalog/[category]) the default `type`
   * is just that category, not every category like on the shared /catalog. */
  defaultCategorySlug?: string;
}

export default function CatalogFilter({
  allCategories,
  handleApplyFilters,

  isOpenModal = false,
  closeModal,
  className = "",
  defaultCategorySlug,
}: CatalogFilterProps) {
  const searchParams = useSearchParams();

  const router = useRouter();

  const pathname = usePathname();

  const t = useTranslations("catalogPage");

  const [filters, setFilters] = useState<FiltersState>({
    type: [],
    availability: [],
  });

  const categoriesList = allCategories
    ? allCategories
        .sort((a, b) => a.pos - b.pos)
        .map((category) => ({
          title: category.name,
          category: category.slug,
        }))
    : [];

  const allCategoriesSlugs = categoriesList.map((c) => c.category).join(",");

  useEffect(() => {
    if (!searchParams) return;

    const typeParam = searchParams.get("type");
    const newParam = searchParams.get("new");
    const availabilityParam = searchParams.get("availability");
    const priceFromParam = searchParams.get("priceFrom");
    const priceToParam = searchParams.get("priceTo");

    // Усі відсутні параметри дописуємо в URL ОДНИМ router.replace — окремі
    // виклики для кожного параметра базувались на тому самому "застарілому"
    // searchParams і перезаписували один одного (лишався тільки останній),
    // через що категорія/наявність тимчасово зникали з URL і на місці
    // товарів на мить показувалось "немає товарів".
    const resolvedType = typeParam ?? defaultCategorySlug ?? allCategoriesSlugs;
    const resolvedAvailability =
      availabilityParam ?? "in-stock,pre-order,out-of-stock";
    const resolvedPriceFrom = priceFromParam ?? "499";
    const resolvedPriceTo = priceToParam ?? "4999";

    if (
      !typeParam ||
      !availabilityParam ||
      !priceFromParam ||
      !priceToParam
    ) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("type", resolvedType);
      newParams.set("availability", resolvedAvailability);
      newParams.set("priceFrom", resolvedPriceFrom);
      newParams.set("priceTo", resolvedPriceTo);

      router.replace(`${pathname}?${newParams.toString()}`);
    }

    // Обробка type
    const type = resolvedType
      ? resolvedType.split(",").map((slug) => {
          const found = allCategories.find((cat) => cat.slug === slug);
          return {
            category: slug,
            title: found?.name || slug,
          };
        })
      : [];

    const availability = resolvedAvailability
      ? resolvedAvailability.split(",").map((value) => ({
          value,
          title:
            value === "in-stock"
              ? t("inStock")
              : value === "pre-order"
              ? t("preOrder")
              : value === "out-of-stock"
              ? t("outOfStock")
              : value,
        }))
      : [];

    setFilters({
      type,
      newValue: newParam === "true",
      availability,
      priceFrom: Number(resolvedPriceFrom),
      priceTo: Number(resolvedPriceTo),
    });
  }, [
    searchParams,
    allCategories,
    t,
    router,
    pathname,
    allCategoriesSlugs,
    defaultCategorySlug,
  ]);

  const applyFilters = () => {
    handleApplyFilters(filters);
    if (closeModal) closeModal();
  };

  return (
    <>
      <div
        className={`block shrink-0 tabxl:w-[311px] h-[calc(100dvh-82px-76px)] tabxl:h-fit py-5 px-6 rounded-[12px] shadow-catalogFilter bg-surface overflow-y-auto scrollbar scrollbar-w-[2.5px] scrollbar-thumb-rounded-full 
      scrollbar-track-rounded-full scrollbar-thumb-orange scrollbar-track-transparent ${className}`}
      >
        <TypeFilter
          allCategories={allCategories}
          value={filters.type}
          newValue={filters.newValue ?? false}
          onChange={(type) => setFilters((f) => ({ ...f, type }))}
          onChangeNew={(newVal) =>
            setFilters((prev) => ({ ...prev, newValue: newVal }))
          }
        />
        <AvailabilityFilter
          value={filters.availability}
          onChange={(availability) =>
            setFilters((f) => ({ ...f, availability }))
          }
        />
        <PriceFilter
          value={[filters.priceFrom ?? 499, filters.priceTo ?? 4999]}
          onChange={([priceFrom, priceTo]) =>
            setFilters((f) => ({
              ...f,
              priceFrom,
              priceTo,
            }))
          }
        />
        <Button
          onClick={() => handleApplyFilters(filters)}
          className="hidden tabxl:flex w-full h-[54px]"
        >
          {t("apply")}
        </Button>
      </div>
      {isOpenModal && (
        <div className="tabxl:hidden absolute bottom-0 left-0 w-full h-[76px] p-5 bg-surface rounded-t-[12px] shadow-filterButton">
          <Button onClick={applyFilters} className="w-full h-[36px]">
            {t("apply")}
          </Button>
        </div>
      )}
    </>
  );
}
