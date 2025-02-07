"use client";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./sliderStyles.css";

import React, { useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./productCard/ProductCard";
import { ProductItem } from "@/types/productItem";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import EmptyCategory from "./EmptyCategory";

interface CatalogSliderProps {
  title: string;
  products: ProductItem[];
}

export default function CatalogSlider({ title, products }: CatalogSliderProps) {
  const [isCharacteristicsPopUpShown, setIsCharacteristicsPopUpShown] =
    useState(false);
  const [isComplectationPopUpShown, setIsComplectationPopUpShown] =
    useState(false);

  return (
    <li id={title || ""}>
      <h2 className="container w-full max-w-[1920px] mb-[30px] text-22bold laptop:text-40bold text-center">
        {title}
      </h2>
      {products.length > 0 ? (
        <Swiper
          centeredSlides={true}
          slidesPerView="auto"
          breakpoints={{
            0: {
              spaceBetween: 10,
            },
            440: {
              spaceBetween: 30,
            },
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          loop={true}
          speed={1000}
          modules={[Pagination, Navigation]}
        >
          {products.map((product) => (
            <SwiperSlide key={product?.id}>
              <ProductCard
                product={product}
                isCharacteristicsPopUpShown={isCharacteristicsPopUpShown}
                setIsCharacteristicsPopUpShown={setIsCharacteristicsPopUpShown}
                isComplectationPopUpShown={isComplectationPopUpShown}
                setIsComplectationPopUpShown={setIsComplectationPopUpShown}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyCategory />
      )}
      <Backdrop
        isVisible={isCharacteristicsPopUpShown || isComplectationPopUpShown}
        onClick={() => {
          setIsCharacteristicsPopUpShown(false);
          setIsComplectationPopUpShown(false);
        }}
      />
    </li>
  );
}
