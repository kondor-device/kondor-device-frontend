"use client";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../homePage/catalog/sliderStyles.css";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductItem } from "@/types/productItem";
import CatalogCard from "../catalogPage/CatalogCard";
import { useTranslations } from "next-intl";

interface SimilarProductsSliderProps {
  similarProducts: {
    categoryId: string;
    categoryName: string;
    items: ProductItem[];
  } | null;
  addons: ProductItem[];
}

export default function SimilarProductsSlider({
  similarProducts,
  addons,
}: SimilarProductsSliderProps) {
  const t = useTranslations("productPage");

  if (!similarProducts) return null;

  const { items } = similarProducts;

  // 1. Відфільтровуємо товари
  const filteredItems = similarProducts.items.filter(
    (item) => item.showonmain !== true
  );

  // 2. Додаємо дублікати, якщо менше 5
  let extendedItems = [...filteredItems];

  while (extendedItems.length < 5 && filteredItems.length > 0) {
    const needed = 5 - extendedItems.length;
    extendedItems = [...extendedItems, ...filteredItems.slice(0, needed)];
  }

  if (extendedItems.length === 0) return null;

  return (
    <section className="container max-w-[1920px] mb-8 desk:mb-[100px]">
      <h2 className="mb-[30px] desk:mb-[60px] text-[22px] desk:text-[36px] font-bold leading-[120%]">
        {t("similar")}
      </h2>
      <Swiper
        breakpoints={{
          0: {
            spaceBetween: 10,
            slidesPerView: 2,
          },
          540: {
            spaceBetween: 12,
            slidesPerView: 3,
          },
          640: {
            spaceBetween: 12,
            slidesPerView: 4,
          },
          1024: {
            spaceBetween: 16,
            slidesPerView: 4,
          },
          1550: {
            spaceBetween: 24,
            slidesPerView: 4,
          },
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        speed={1000}
        modules={[Pagination, Navigation]}
        className=""
      >
        {items?.length > 0
          ? extendedItems.map((item, idx) => (
              <SwiperSlide key={idx}>
                <CatalogCard product={item} shownOnAddons={addons} />
              </SwiperSlide>
            ))
          : null}
      </Swiper>
    </section>
  );
}
