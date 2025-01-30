"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./sliderStyles.css";

import React from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import { ProductItem } from "@/types/productItem";

interface CatalogSliderProps {
  productsList: ProductItem[];
}

export default function CatalogSlider({ productsList }: CatalogSliderProps) {
  const settings = {
    dots: true,
    centerMode: true,
    className: "center",
    centerPadding: "17.4%",
    responsive: [
      {
        breakpoint: 1280, // 1025 - 1280px
        settings: {
          centerPadding: "5.13%",
        },
      },
      {
        breakpoint: 1024, // 768 - 1024px
        settings: {
          centerPadding: "17.4%",
        },
      },
      {
        breakpoint: 768, // До 768px
        settings: {
          centerPadding: "5.13%",
        },
      },
    ],
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    swipeToSlide: true,
    speed: 500,
    cssEase: "ease-out",
  };

  return (
    <div className="overflow-hidden pb-[22px] laptop:pb-16">
      <div>
        <Slider {...settings}>
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          {/* {productsList.map((product, idx) => (
                <ProductCard key={idx} product={product} />
              ))} */}
        </Slider>
      </div>
    </div>
  );
}
