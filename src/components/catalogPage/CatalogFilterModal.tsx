"use client";
import { useEffect, useRef } from "react";
import CatalogFilter from "./catalogFilter/CatalogFilter";
import { FiltersState } from "./catalogFilter/CatalogFilter";
import IconClose from "../shared/icons/IconCLose";
import { CategoryItem } from "@/types/categoryItem";

interface CatalogFilterModalProps {
  allCategories: CategoryItem[];
  handleApplyFilters: (filters: FiltersState) => void;
  isOpen: boolean;
  onClose: () => void;
  defaultCategorySlug?: string;
}
export default function CatalogFiltersModal({
  allCategories,
  handleApplyFilters,
  isOpen,
  onClose,
  defaultCategorySlug,
}: CatalogFilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Модалка змонтована завжди, а відкриття/закриття — лише opacity+visibility
  // (CSS). Раніше вона монтувалась/розмонтовувалась через AnimatePresence на
  // кожне відкриття: ~170 нових DOM-вузлів (чекбокси, повзунок HeroUI) у
  // перший же кадр анімації, і слабкий Android не встигав їх малювати —
  // модалка миготіла.
  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[70] rounded-[12px] transition-[opacity,visibility] duration-200 ease-out ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="tabxl:hidden absolute z-[70] top-[60px] inset-x-0 mx-auto w-[calc(100%-40px)] max-w-[400px] bg-surface h-[calc(100dvh-82px)] rounded-[12px]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 cursor-pointer flex items-center justify-center size-[32px] p-1 md:p-0  xl:hover:text-fg focus-visible:text-fg transition duration-300 ease-in-out"
        >
          <IconClose className="rotate-45" />
        </button>

        <CatalogFilter
          handleApplyFilters={handleApplyFilters}
          allCategories={allCategories}
          isOpenModal={isOpen}
          closeModal={onClose}
          defaultCategorySlug={defaultCategorySlug}
        />
      </div>
    </div>
  );
}
