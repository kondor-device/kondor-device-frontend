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
    centerPadding: "300px",
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
          centerPadding: "200px",
        },
      },
      {
        breakpoint: 768, // 540 - 768px
        settings: {
          centerPadding: "80px",
        },
      },
      {
        breakpoint: 540, // До 540px
        settings: {
          centerPadding: "20px",
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
    <div className="pb-[22px] laptop:pb-16">
      <Slider {...settings}>
        {/* {productsList.map((product, idx) => (
                <ProductCard key={idx} product={product} />
              ))} */}
      </Slider>
    </div>
  );
}
