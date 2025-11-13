"use client";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./sliderStyles.css";

import React from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./productCard/ProductCard";
import { ProductItem } from "@/types/productItem";
import EmptyCategory from "./EmptyCategory";
import AnimationWrapper from "../hero/AnimationWrapper";
import { Link } from "@/i18n/routing";

interface CatalogSliderProps {
  id: string;
  title: string;
  slug: string;
  products: ProductItem[];
  shownOnAddonsProducts: ProductItem[];
}

export default function CatalogSlider({
  id,
  title,
  slug,
  products,
  shownOnAddonsProducts,
}: CatalogSliderProps) {
  const searchParams =
    "&priceTo=4999&sort=default&priceFrom=499&availability=in-stock%2Cpre-order";

  return (
    <li id={id} className="scroll-mt-[60px] tabxl:scroll-mt-[113px]">
      <AnimationWrapper
        sectionId={id}
        commonStyles={`container w-full max-w-[1920px] mb-[30px] transition duration-700 ease-slow`}
        visibleStyles="opacity-100 translate-x-0"
        unVisibleStyles="opacity-0 -translate-x-[50px]"
      >
        <Link href={`/catalog?type=${slug}${searchParams}`} className="group">
          <h2 className="text-22bold tabxl:text-32bold laptop:text-40bold text-center laptop:group-hover:text-yellow focus-visible:text-yellow active:text-yellow active:scale-95 transition duration-300 ease-in-out">
            {title}
          </h2>
        </Link>
      </AnimationWrapper>
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
          {products.map((product, idx) => (
            <SwiperSlide key={idx}>
              <ProductCard
                product={product}
                shownOnAddonsProducts={shownOnAddonsProducts}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyCategory />
      )}
    </li>
  );
}
