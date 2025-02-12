"use client";

import { ColorOpt } from "@/types/productItem";
import React from "react";

interface ColorPickerProps {
  coloropts: ColorOpt[];
  selectedColorIndex: number;
  setSelectedColorIndex: (index: number) => void;
}

export default function ColorPicker({
  coloropts,
  selectedColorIndex,
  setSelectedColorIndex,
}: ColorPickerProps) {
  return (
    <ul className="flex gap-x-[10px] tabxl:gap-x-5 mb-[5px] tabxl:mb-[15px]">
      {coloropts.map(({ code, colorset }, index) => (
        <li
          key={code}
          className={`size-[18px] tabxl:size-8 deskxl:size-[45px] rounded-full cursor-pointer transition duration-300 ease-out ${
            selectedColorIndex === index
              ? "shadow-colorPickerThin tabxl:shadow-colorPicker"
              : ""
          } ${colorset.hex === "000000" ? "border border-yellow" : ""}`}
          style={{ backgroundColor: colorset.hex }}
          onClick={() => setSelectedColorIndex(index)}
        ></li>
      ))}
    </ul>
  );
}
