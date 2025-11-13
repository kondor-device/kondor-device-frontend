import { Characteristic } from "@/types/productItem";
import React from "react";

interface CharacteristicItemProps {
  characteristicItem: Characteristic;
}

export default function CharacteristicItem({
  characteristicItem,
}: CharacteristicItemProps) {
  const { name, char } = characteristicItem;

  return (
    <li
      className="relative laptop:flex w-fit even:py-1 even:before:content-[''] before:absolute before:top-0 before:-left-5 tab:before:-left-3 before:right-0 before:-z-10  
        before:h-full before:w-[calc(100%+32px)] tab:before:w-[calc(100%+24px)] even:before:bg-yellowGradient before:rounded-r-[10px] tab:before:rounded-[10px]"
    >
      <h3 className="laptop:w-[200px] text-14med laptop:text-18med">{name}:</h3>
      <p className="laptop:w-[calc(100%-200px)] text-14bold laptop:text-18bold">
        {char}
      </p>
    </li>
  );
}
