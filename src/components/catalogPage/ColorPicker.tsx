"use client";

import { ColorOpt } from "@/types/productItem";

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
    <div className="mb-5 desk:mb-4">
      <div className="text-12bold laptop:text-12bold desk:text-14bold mb-3 desk:mb-4">
        Колір:{" "}
        <span className="text-12med laptop:text-12bold desk:text-14med lowercase text-grey">
          {selectedColorName}
        </span>
      </div>

      <ul className="flex gap-x-2">
        {coloropts.map(({ code, colorset }, index) => {
          const isSelected = selectedColorIndex === index;

          return (
            <li
              key={code}
              className={`relative flex items-center justify-center size-5 rounded-full cursor-pointer transition 
                duration-300 ease-out ${
                  isSelected ? "shadow-colorPicker" : "shadow-inner"
                } `}
              style={{ backgroundColor: colorset.hex }}
              onClick={() => setSelectedColorIndex(index)}
            >
              {isSelected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 text-yellow"
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
