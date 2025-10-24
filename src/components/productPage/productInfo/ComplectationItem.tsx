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
      className="relative flex items-center gap-x-5 w-fit even:py-1 even:before:content-[''] before:absolute before:top-0 before:-left-5 
      tab:before:-left-3 before:-z-10 before:w-[calc(100%+32px)] tab:before:w-[calc(100%+24px)]
        before:h-full even:before:bg-yellowGradient before:rounded-r-[10px] tab:before:rounded-[10px]"
    >
      <Image
        src={icon?.url || "/images/icons/logoSmall.svg"}
        alt={icon?.alt || "icon"}
        width={24}
        height={24}
        unoptimized
        className="size-[24px]"
      />
      <p className="text-14bold laptop:text-18bold">{name || ""}</p>
    </li>
  );
}
