import React from "react";
import AnimationWrapper from "../hero/AnimationWrapper";

interface StageItemProps {
  stageItem: {
    title: string;
    description: string;
  };
  idx: number;
}

export default function StageItem({ stageItem, idx }: StageItemProps) {
  const { title, description } = stageItem;

  return (
    <li className="leading-none">
      <AnimationWrapper
        sectionId="delivery"
        commonStyles={`mb-[5px] laptop:mb-[15px] transition duration-700 ease-slow ${
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
        <h3 className="text-14bold laptop:text-18bold desk:text-24bold">
          {title}
        </h3>
      </AnimationWrapper>
      <span className="text-12med laptop:text-16med desk:text-24med">
        {description}
      </span>
    </li>
  );
}
