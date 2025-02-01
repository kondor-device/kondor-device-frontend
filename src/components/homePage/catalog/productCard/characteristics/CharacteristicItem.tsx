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
      className="relative laptop:flex  laptop:w-fit even:py-2 even:before:content-[''] before:absolute before:top-0 before:-right-[5px] laptop:before:-right-4 before:-z-10 before:w-screen 
        before:h-full even:before:bg-yellowGradient before:rounded-[10px]"
    >
      <h4 className="laptop:w-[200px] text-14med laptop:text-18med">{name}:</h4>
      <p className="laptop:w-[calc(100%-200px)] text-14bold laptop:text-18bold">
        {char}
      </p>
    </li>
  );
}
