"use client";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { burgerMenuVariants } from "@/utils/animationVariants";
import CatalogFilter from "./catalogFilter/CatalogFilter";
import { FiltersState } from "./catalogFilter/CatalogFilter";
import IconClose from "../shared/icons/IconCLose";
import { CategoryItem } from "@/types/categoryItem";

interface CatalogFilterModalProps {
  allCategories: CategoryItem[];
  handleApplyFilters: (filters: FiltersState) => void;
  isOpen: boolean;
  onClose: () => void;
}
export default function CatalogFiltersModal({
  allCategories,
  handleApplyFilters,
  isOpen,
  onClose,
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

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] rounded-[12px]"
          onClick={handleClickOutside}
        >
          <motion.div
            ref={modalRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={burgerMenuVariants}
            className={`${
              isOpen ? "no-doc-scroll" : ""
            } tabxl:hidden absolute z-[70] top-[82px] left-1/2 transform -translate-x-1/2 w-[calc(100%-40px)] max-w-[400px] bg-white h-[calc(100dvh-82px)] rounded-[12px]`}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 cursor-pointer flex items-center justify-center size-[32px] p-1 md:p-0  xl:hover:text-dark focus-visible:text-dark transition duration-300 ease-in-out"
            >
              <IconClose className="rotate-45" />
            </button>

            <CatalogFilter
              handleApplyFilters={handleApplyFilters}
              allCategories={allCategories}
              isOpenModal={isOpen}
              closeModal={onClose}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
