import React from "react";
import Image from "next/image";
import AnimationWrapper from "../hero/AnimationWrapper";

interface BenefitItemProps {
  benefitItem: {
    title: string;
    description: string;
    icon: string;
  };
  idx: number;
}

export default function BenefitItem({ benefitItem, idx }: BenefitItemProps) {
  const { title, description, icon } = benefitItem;

  return (
    <li className="flex flex-col justify-center w-[48.5%] laptop:w-full px-[18px] py-[25px] laptop:p-[30px] desk:p-[50px] rounded-[15px] laptop:rounded-[30px] bg-yellowGradient">
      <Image
        src={`/images/icons/${icon}.svg`}
        alt={title}
        width="40"
        height="40"
        unoptimized
        className="w-10 laptop:w-20 h-auto mb-[15px] laptop:mb-[30px]"
      />
      <AnimationWrapper
        sectionId="home-page-benefits"
        commonStyles={`max-w-[140px] desk:max-w-[174px] mb-2 laptop:mb-4 transition duration-700 ease-slow ${
          idx === 0
            ? ""
            : idx === 1
            ? "delay-300"
            : idx === 2
            ? "delay-[600ms]"
            : "delay-[900ms]"
        }`}
        visibleStyles="opacity-100 translate-x-0"
        unVisibleStyles="opacity-0 -translate-x-[20px]"
      >
        <h3 className="text-12semi laptop:text-20semi desk:text-24semi">
          {title}
        </h3>
      </AnimationWrapper>
      <AnimationWrapper
        sectionId="home-page-benefits"
        commonStyles={`max-w-[134px] tab:max-w-full tab:w-[235px] tabxl:w-[179px] desk:w-[229px] transition duration-700 ease-slow ${
          idx === 0
            ? ""
            : idx === 1
            ? "delay-500"
            : idx === 2
            ? "delay-[800ms]"
            : "delay-[1100ms]"
        }`}
        visibleStyles="opacity-100 translate-y-0"
        unVisibleStyles="opacity-0 translate-y-[20px]"
      >
        <p className="text-12med laptop:text-14med desk:text-18med">
          {description}
        </p>
      </AnimationWrapper>
    </li>
  );
}
