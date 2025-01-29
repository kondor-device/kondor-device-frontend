import React from "react";

interface StageItemProps {
  stageItem: {
    title: string;
    description: string;
  };
}

export default function StageItem({ stageItem }: StageItemProps) {
  const { title, description } = stageItem;

  return (
    <li className="leading-none">
      <h3 className="mb-[5px] laptop:mb-[15px] text-14bold laptop:text-18bold desk:text-24bold">
        {title}
      </h3>
      <span className="text-12med laptop:text-16med desk:text-24med">
        {description}
      </span>
    </li>
  );
}
