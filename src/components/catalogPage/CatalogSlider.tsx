"use client";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../homePage/catalog/sliderStyles.css";

import { useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CategoryItem } from "@/types/categoryItem";
import CatalogCard from "./CatalogCard";
import { ProductItem } from "@/types/productItem";
import EmptyCategory from "../homePage/catalog/EmptyCategory";

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
  const searchParams = useSearchParams();

  const newItems = searchParams.get("new");
  const availability = searchParams.get("availability");
  const priceFrom = Number(searchParams.get("priceFrom"));
  const priceTo = Number(searchParams.get("priceTo"));
  const sort = searchParams.get("sort");

  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    swiperRef.current?.slideToLoop(0, 0);
    swiperRef.current?.update();
  }, [currentCategories]);

  let currentItems = currentCategories
    .flatMap((category) => category.items)
    .filter((item) => item.showonmain === false);

  // Логіка availability (in-stock або pre-order)
  if (availability === "in-stock") {
    currentItems = currentItems.filter((item) => item.preorder !== true);
  } else if (availability === "pre-order") {
    currentItems = currentItems.filter((item) => item.preorder === true);
  }

  // Логіка "new"
  if (newItems === "true") {
    currentItems = currentItems.filter((item) => item.newItem === true);
  }

  // Логіка priceFrom / priceTo
  currentItems = currentItems.filter((item) => {
    const actualPrice = item.priceDiscount ?? item.price;
    if (!isNaN(priceFrom) && actualPrice < priceFrom) return false;
    if (!isNaN(priceTo) && actualPrice > priceTo) return false;
    return true;
  });

  // Сортування
  currentItems.sort((a, b) => {
    const priceA = a.priceDiscount ?? a.price;
    const priceB = b.priceDiscount ?? b.price;

    const getModelName = (fullName: string) => {
      if (!fullName) return "";
      const parts = fullName.trim().split(/\s+/); // видаляє зайві пробіли
      return parts.slice(1).join(" ").toLowerCase(); // повертає модель
    };

    switch (sort) {
      case "price-ascending":
        return priceA - priceB;

      case "price-descending":
        return priceB - priceA;

      case "discount":
        const discountA =
          ((a.price - (a.priceDiscount ?? a.price)) / a.price) * 100;
        const discountB =
          ((b.price - (b.priceDiscount ?? b.price)) / b.price) * 100;
        return discountB - discountA;

      case "name-ascending":
        return getModelName(a.name).localeCompare(getModelName(b.name));

      case "name-descending":
        return getModelName(b.name).localeCompare(getModelName(a.name));

      default:
        return 0;
    }
  });

  const itemsPerView = 6;

  const chunkArray = (array: ProductItem[], size: number): ProductItem[][] => {
    const chunks: ProductItem[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const groupedItems = chunkArray(currentItems, itemsPerView);

  return (
    <>
      {currentItems.length > 0 ? (
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          centeredSlides={true}
          slidesPerView={1}
          autoHeight={true}
          breakpoints={{
            0: {
              spaceBetween: 12,
            },
            1550: {
              spaceBetween: 24,
            },
          }}
          pagination={{
            clickable: true,
          }}
          navigation={groupedItems.length > 1}
          loop={true}
          speed={1000}
          modules={[Pagination, Navigation]}
          className={`${isOpenDropdown ? "pointer-events-none" : ""}`}
        >
          {groupedItems.map((group, groupIdx) => (
            <SwiperSlide key={groupIdx}>
              <div className="flex flex-wrap gap-x-3 gap-y-4 laptop:gap-x-6 laptop:gap-y-[30px]">
                {group.map((item, idx) => (
                  <CatalogCard
                    key={item.id ?? idx}
                    product={item}
                    shownOnAddons={shownOnAddons}
                    className="w-[calc(50%-6px)] tab:w-[calc(33.33%-8px)] laptop:w-[calc(33.33%-16px)]"
                  />
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyCategory className="mt-[80px] tabxl:mt-[160px]" />
      )}
    </>
  );
}
