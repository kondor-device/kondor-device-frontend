"use client";

import "swiper/css";
import "swiper/css/pagination";
import "../homePage/catalog/sliderStyles.css";

import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BlogCard from "../blogPage/BlogCard";
import { BlogPostPreview } from "@/types/blog";

interface OtherPostsSliderProps {
  posts: BlogPostPreview[];
}

export default function OtherPostsSlider({ posts }: OtherPostsSliderProps) {
  return (
    <Swiper
      breakpoints={{
        0: { spaceBetween: 12, slidesPerView: 1 },
        640: { spaceBetween: 16, slidesPerView: 2 },
        1024: { spaceBetween: 16, slidesPerView: 3 },
      }}
      pagination={{ clickable: true }}
      speed={700}
      modules={[Pagination]}
    >
      {posts.map((post) => (
        <SwiperSlide key={post.slug}>
          <BlogCard post={post} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
