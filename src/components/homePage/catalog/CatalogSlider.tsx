"use client";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./sliderStyles.css";

import React from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";
import { ProductItem } from "@/types/productItem";

interface CatalogSliderProps {
  title: string;
  products: ProductItem[];
}

export default function CatalogSlider({ title, products }: CatalogSliderProps) {
  return (
    <li>
      <h2 className="mb-[30px] text-22bold laptop:text-40bold text-center">
        {title}
      </h2>
      <Swiper
        centeredSlides={true}
        breakpoints={{
          0: {
            spaceBetween: 10,
            slidesPerView: 1.11,
          },
          440: {
            spaceBetween: 30,
            slidesPerView: 1.3,
          },
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        speed={1000}
        modules={[Pagination, Navigation]}
        className="reviewsSlider"
      >
        {products.map((product, idx) => (
          <SwiperSlide key={idx} className="reviewsSlider">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </li>
  );
}
