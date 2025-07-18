"use client";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../homePage/catalog/cart/addonProducts/AddonItemMob";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductItem } from "@/types/productItem";
import AddonItemMob from "../homePage/catalog/cart/addonProducts/AddonItemMob";
import { useTranslations } from "next-intl";

interface AddonsSliderMobProps {
  addons: ProductItem[];
}

export default function AddonsSlider({ addons }: AddonsSliderMobProps) {
  const t = useTranslations("productPage");

  if (!addons) return null;

  // 1. Фільтрація — тільки ті, у кого showonmain не true
  const filteredAddons = addons.filter((item) => item.showonmain !== true);

  // 2. Додаємо дублікати, якщо їх менше 5
  let extendedAddons = [...filteredAddons];

  while (extendedAddons.length < 5 && filteredAddons.length > 0) {
    const needed = 5 - extendedAddons.length;
    extendedAddons = [...extendedAddons, ...filteredAddons.slice(0, needed)];
  }

  return (
    <section className="container max-w-[1920px] mb-8 desk:mb-[100px]">
      <h2 className="mb-[30px] desk:mb-[60px] text-[22px] desk:text-[36px] font-bold leading-[120%]">
        {t("addons")}
      </h2>
      <Swiper
        breakpoints={{
          0: {
            spaceBetween: 10,
            slidesPerView: 2,
          },
          540: {
            spaceBetween: 12,
            slidesPerView: 3,
          },
          640: {
            spaceBetween: 12,
            slidesPerView: 4,
          },
          1024: {
            spaceBetween: 16,
            slidesPerView: 4,
          },
          1550: {
            spaceBetween: 24,
            slidesPerView: 4,
          },
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        speed={1000}
        modules={[Pagination, Navigation]}
        className=""
      >
        {extendedAddons?.length > 0
          ? extendedAddons.map((addonItem, idx) => (
              <SwiperSlide key={idx}>
                <AddonItemMob addonItem={addonItem} />
              </SwiperSlide>
            ))
          : null}
      </Swiper>
    </section>
  );
}
