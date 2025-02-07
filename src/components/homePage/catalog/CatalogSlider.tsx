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
import CartButton from "./CartButton";
import EmptyCategory from "./EmptyCategory";

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
  const [isCheckoutPopUpShown, setIsCheckoutPopUpShown] = useState(false);

  return (
    <li id={title || ""} className="scroll-mt-[102px] tab:scroll-mt-[133px]">
      <h2 className="container w-full max-w-[1920px] mb-[30px] text-22bold laptop:text-40bold text-center">
        {title}
      </h2>
      {products.length ? (
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
          loop={products.length > 3 ? true : false}
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
                isCheckoutPopUpShown={isCheckoutPopUpShown}
                setIsCheckoutPopUpShown={setIsCheckoutPopUpShown}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyCategory />
      )}
      <Backdrop
        isVisible={
          isCharacteristicsPopUpShown ||
          isComplectationPopUpShown ||
          isCartPopUpShown ||
          isCheckoutPopUpShown
        }
        onClick={() => {
          setIsCharacteristicsPopUpShown(false);
          setIsComplectationPopUpShown(false);
          setIsCartPopUpShown(false);
          setIsCheckoutPopUpShown(false);
        }}
      />
      <CartButton setIsCartPopUpShown={setIsCartPopUpShown} />
    </li>
  );
}
