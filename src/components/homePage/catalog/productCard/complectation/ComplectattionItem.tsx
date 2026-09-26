import { ComplectItem } from "@/types/productItem";
import Image from "next/image";
import React from "react";

interface ComplectationItemProps {
  complectation: ComplectItem;
}

export default function ComplectationItem({
  complectation,
}: ComplectationItemProps) {
  const { name, icon } = complectation;

  return (
    <li
      className="relative flex items-center gap-x-5 laptop:w-fit even:py-2 even:before:content-[''] before:absolute before:top-0 before:-right-[5px] laptop:before:-right-4 before:-z-10 before:w-screen 
        before:h-full even:before:bg-yellowGradient even:text-dark dark:odd:[&_img]:brightness-0 dark:odd:[&_img]:invert before:rounded-[10px]"
    >
      <Image
        src={icon?.url || "/images/icons/logoSmall.svg"}
        alt={icon?.alt || "icon"}
        width={24}
        height={24}
        className="size-[24px]"
      />
      <p className="text-14bold laptop:text-18bold">{name || ""}</p>
    </li>
  );
}
