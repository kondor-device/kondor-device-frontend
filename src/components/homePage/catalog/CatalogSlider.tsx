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
import { useCartStore } from "@/store/cartStore";

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

  const { cartItems } = useCartStore();

  console.log(cartItems);

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
      {cartItems.length ? (
        <IconButton
          handleClick={() => setIsCartPopUpShown(true)}
          data-label={cartItems.length.toString()}
          className="fixed z-[5] right-6 bottom-6 before:content-[attr(data-label)] before:absolute before:top-[-11px] before:right-[-11px] before:size-[22px] 
          before:text-12semi before:text-white before:rounded-full before:bg-dark"
        >
          <Image
            src="/images/icons/cart.svg"
            alt="cart icon"
            width="71"
            height="71"
          />
        </IconButton>
      ) : null}
    </li>
  );
}
