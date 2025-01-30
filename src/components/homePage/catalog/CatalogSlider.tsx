"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./sliderStyles.css";

import React from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";

interface CatalogSliderProps {
  productsList: string[];
}

export default function CatalogSlider({ productsList }: CatalogSliderProps) {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    swipeToSlide: true,
    speed: 500,
    cssEase: "ease-out",
  };

  return (
    <div className="overflow-hidden">
      <div className="slider-container">
        <Slider {...settings}>
          <div>
            <ul className="flex flex-wrap justify-center gap-4">
              {productsList.map((product, idx) => (
                <ProductCard key={idx} product={product} />
              ))}
            </ul>
          </div>
        </Slider>
      </div>
    </div>
  );
}
