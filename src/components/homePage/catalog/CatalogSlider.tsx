"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./sliderStyles.css";

import React from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import { ProductItem } from "@/types/productItem";

interface CatalogSliderProps {
  title: string;
  products: ProductItem[];
}

export default function CatalogSlider({ title, products }: CatalogSliderProps) {
  const settings = {
    dots: true,
    centerMode: true,
    className: "center",
    centerPadding: "200px",
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
          centerPadding: "5%",
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
    <li>
      <h2 className="mb-[30px] text-22bold laptop:text-40bold text-center">
        {title}
      </h2>
      <Slider {...settings}>
        {products.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </Slider>
    </li>
  );
}
