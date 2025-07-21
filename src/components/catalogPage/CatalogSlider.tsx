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
import { useCatalogItemsPerPage } from "@/hooks/useCatalogItemsPerPage";

interface CatalogSliderProps {
  currentCategories: CategoryItem[];
  shownOnAddons: ProductItem[];
  categoryArray: string[];
}

export default function CatalogSlider({
  currentCategories,
  shownOnAddons,
  categoryArray,
}: CatalogSliderProps) {
  const searchParams = useSearchParams();
  const availability = searchParams.get("availability");
  const priceFrom = Number(searchParams.get("priceFrom"));
  const priceTo = Number(searchParams.get("priceTo"));

  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    swiperRef.current?.slideToLoop(0, 0);
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
  if (categoryArray.includes("new")) {
    currentItems = currentItems.filter((item) => item.newItem === true);
  }

  // Логіка priceFrom / priceTo
  currentItems = currentItems.filter((item) => {
    const actualPrice = item.priceDiscount ?? item.price;
    if (!isNaN(priceFrom) && actualPrice < priceFrom) return false;
    if (!isNaN(priceTo) && actualPrice > priceTo) return false;
    return true;
  });

  const itemsPerView = useCatalogItemsPerPage();

  const chunkArray = (array: ProductItem[], size: number): ProductItem[][] => {
    const chunks: ProductItem[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const groupedItems = chunkArray(currentItems, itemsPerView);

  return (
    <Swiper
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      centeredSlides={true}
      slidesPerView={1}
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
      className="catalog-page-slider"
    >
      {groupedItems.map((group, groupIdx) => (
        <SwiperSlide key={groupIdx}>
          <div className="flex flex-wrap gap-x-3 gap-y-4 laptop:gap-x-6 laptop:gap-y-[30px]">
            {group.map((item, idx) => (
              <CatalogCard
                key={item.id ?? idx}
                product={item}
                shownOnAddons={shownOnAddons}
                className="w-[calc(50%-6px)] tabxl:w-[calc(33.33%-16px)]"
              />
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
