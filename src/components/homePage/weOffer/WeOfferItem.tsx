import React from "react";
import Image from "next/image";
import AnimationWrapper from "../hero/AnimationWrapper";

interface WeOfferItemProps {
  weOfferItem: {
    title: string;
    icon: string;
  };
  idx: number;
}

export default function WeOfferItem({ weOfferItem, idx }: WeOfferItemProps) {
  const { title, icon } = weOfferItem;

  return (
    <li className="flex items-center gap-x-[15px] laptop:gap-x-5 w-full max-w-[545px] px-[30px] deskxl:px-[39px] py-5 laptop:py-[30px] rounded-[20px] bg-yellowGradient">
      <AnimationWrapper
        sectionId="home-page-we-offer"
        commonStyles={`w-[46px] h-[46px] transition duration-700 ease-slow ${
          idx === 0 ? "" : idx === 1 ? "delay-300" : "delay-[600ms]"
        }`}
        visibleStyles="opacity-100 translate-x-0"
        unVisibleStyles="opacity-0 -translate-x-[20px]"
      >
        <Image
          src={`/images/icons/${icon}Black.svg`}
          alt={icon}
          width="46"
          height="46"
          className="max-w-full max-h-full"
        />
      </AnimationWrapper>
      <AnimationWrapper
        sectionId="home-page-we-offer"
        commonStyles={`max-w-[70%] transition duration-700 ease-slow ${
          idx === 0
            ? "delay-300"
            : idx === 1
            ? "delay-[600ms]"
            : "delay-[900ms]"
        }`}
        visibleStyles="opacity-100 translate-y-0"
        unVisibleStyles="opacity-0 translate-y-[20px]"
      >
        <p className="text-14semi laptop:text-16semi deskxl:text-20semi">
          {title}
        </p>
      </AnimationWrapper>
    </li>
  );
}
