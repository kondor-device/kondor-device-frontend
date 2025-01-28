import React from "react";
import Image from "next/image";

interface BenefitItemProps {
  benefitItem: {
    title: string;
    description: string;
    icon: string;
  };
}

export default function BenefitItem({ benefitItem }: BenefitItemProps) {
  const { title, description, icon } = benefitItem;

  return (
    <li className="flex flex-col justify-center w-[48.5%] laptop:w-full px-[18px] py-[25px] laptop:p-[30px] desk:p-[50px] rounded-[15px] laptop:rounded-[30px] bg-yellowGradient">
      <Image
        src={`/images/icons/${icon}.svg`}
        alt={title}
        width="40"
        height="40"
        className="w-10 laptop:w-20 h-auto mb-[15px] laptop:mb-[30px]"
      />
      <h3 className="w-[140px] desk:max-w-[174px] mb-2 laptop:mb-4 text-12semi laptop:text-20semi desk:text-24semi leading-[15px] laptop:leading-[30px]">
        {title}
      </h3>
      <span className="w-[134px] laptop:w-[179px] desk:w-[229px] text-12med laptop:text-14med desk:text-18med leading-[15px] desk:leading-[22px]">
        {description}
      </span>
    </li>
  );
}
