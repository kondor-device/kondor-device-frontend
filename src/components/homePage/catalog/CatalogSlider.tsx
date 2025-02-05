"use client";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./sliderStyles.css";

import React, { useState } from "react";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./productCard/ProductCard";
import { ProductItem } from "@/types/productItem";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import IconButton from "@/components/shared/buttons/IconButton";

interface CatalogSliderProps {
  title: string;
  products: ProductItem[];
  shownOnAddonsProducts: ProductItem[];
}

export default function CatalogSlider({
  title,
  products,
  shownOnAddonsProducts,
}: CatalogSliderProps) {
  const [isCharacteristicsPopUpShown, setIsCharacteristicsPopUpShown] =
    useState(false);
  const [isComplectationPopUpShown, setIsComplectationPopUpShown] =
    useState(false);
  const [isCartPopUpShown, setIsCartPopUpShown] = useState(false);

  return (
    <li>
      <h2 className="container w-full max-w-[1920px] mb-[30px] text-22bold laptop:text-40bold text-center">
        {title}
      </h2>
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
        {products.map((product, idx) => (
          <SwiperSlide key={idx}>
            <ProductCard
              product={product}
              isCharacteristicsPopUpShown={isCharacteristicsPopUpShown}
              setIsCharacteristicsPopUpShown={setIsCharacteristicsPopUpShown}
              isComplectationPopUpShown={isComplectationPopUpShown}
              setIsComplectationPopUpShown={setIsComplectationPopUpShown}
              isCartPopUpShown={isCartPopUpShown}
              setIsCartPopUpShown={setIsCartPopUpShown}
              shownOnAddonsProducts={shownOnAddonsProducts}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Backdrop
        isVisible={
          isCharacteristicsPopUpShown ||
          isComplectationPopUpShown ||
          isCartPopUpShown
        }
        onClick={() => {
          setIsCharacteristicsPopUpShown(false);
          setIsComplectationPopUpShown(false);
          setIsCartPopUpShown(false);
        }}
      />
      <IconButton
        handleClick={() => setIsCartPopUpShown(true)}
        className="fixed z-30 bottom-6 right-4"
      >
        <Image
          src="/images/icons/cart.svg"
          alt="cart icon"
          width="71"
          height="71"
        />
      </IconButton>
    </li>
  );
}
