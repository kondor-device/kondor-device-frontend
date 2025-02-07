"use client";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../sliderStyles.css";

import React from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductItem } from "@/types/productItem";
import AddonItemMob from "./AddonItemMob";

interface AddonsSliderMobProps {
  shownOnAddonsProducts: ProductItem[];
}

export default function AddonsSliderMob({
  shownOnAddonsProducts,
}: AddonsSliderMobProps) {
  return (
    <Swiper
      slidesPerView={2}
      breakpoints={{
        0: {
          spaceBetween: 10,
        },
        440: {
          spaceBetween: 16,
        },
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      loop={true}
      speed={1000}
      modules={[Pagination, Navigation]}
      className="addons-slider"
    >
      {shownOnAddonsProducts.length > 0
        ? shownOnAddonsProducts.map((addonItem) => (
            <SwiperSlide key={addonItem.id}>
              <AddonItemMob addonItem={addonItem} />
            </SwiperSlide>
          ))
        : null}
    </Swiper>
  );
}
