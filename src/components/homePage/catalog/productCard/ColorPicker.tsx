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
  const selectedColorName = coloropts[selectedColorIndex]?.color || "";

  return (
    <div className="mb-3 tabxl:mb-4">
      <div className="text-white text-12bold lg:text-14bold mb-3">
        Колір:{" "}
        <span className="text-12med lg:text-14med lowercase text-grey">
          {selectedColorName}
        </span>
      </div>

      <ul className="flex gap-x-[10px] tabxl:gap-x-5">
        {coloropts.map(({ code, colorset }, index) => {
          const isSelected = selectedColorIndex === index;

          return (
            <li
              key={code}
              className={`relative flex items-center justify-center size-6 tabxl:size-8 deskxl:size-[45px] rounded-full cursor-pointer transition 
                duration-300 ease-out ${
                  isSelected ? "shadow-colorPicker" : ""
                } ${colorset.hex === "000000" ? "border border-yellow" : ""}`}
              style={{ backgroundColor: colorset.hex }}
              onClick={() => setSelectedColorIndex(index)}
            >
              {isSelected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 tabxl:w-5 tabxl:h-5 text-yellow"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-7.364 7.364a1 1 0 01-1.414 0L3.293 9.707a1 1 0 011.414-1.414L8.5 12.086l6.793-6.793a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
