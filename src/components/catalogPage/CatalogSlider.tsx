"use client";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../homePage/catalog/sliderStyles.css";

import { useRef, useEffect } from "react";
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
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    swiperRef.current?.slideToLoop(0, 0);
  }, [currentCategories]);

  const currentItems = categoryArray.includes("new")
    ? currentCategories
        .flatMap((category) => category.items)
        .filter(
          (item) => item.priceDiscount != null && item.showonmain === false
        )
    : currentCategories
        .flatMap((category) => category.items)
        .filter((item) => item.showonmain === false);

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
              />
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
