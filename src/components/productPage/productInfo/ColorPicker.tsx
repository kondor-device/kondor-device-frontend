"use client";

import { ColorOpt } from "@/types/productItem";
import AnimationWrapper from "@/components/homePage/hero/AnimationWrapper";

interface ColorPickerProps {
  coloropts: ColorOpt[];
  selectedColorIndex: number;
  setSelectedColorIndex: (index: number) => void;
}

const SECTION_ID = "product-page-info";

export default function ColorPicker({
  coloropts,
  selectedColorIndex,
  setSelectedColorIndex,
}: ColorPickerProps) {
  const selectedColorName = coloropts[selectedColorIndex]?.color || "";

  return (
    <AnimationWrapper
      sectionId={SECTION_ID}
      commonStyles={`mb-10 transition duration-700 ease-slow `}
      visibleStyles="opacity-100 translate-y-0 delay-[400ms]"
      unVisibleStyles="opacity-0 translate-y-[50px]"
    >
      <div
        id={SECTION_ID}
        className="mb-5 desk:mb-9 text-16bold desk:text-18bold"
      >
        Колір:{" "}
        <span className="text-16med lg:text-18med lowercase text-grey">
          {selectedColorName}
        </span>
      </div>

      <ul className="flex gap-x-[10px] tabxl:gap-x-5">
        {coloropts.map(({ code, colorset }, index) => {
          const isSelected = selectedColorIndex === index;

          return (
            <li
              key={code}
              className={`relative flex items-center justify-center size-[35px] desk:size-[45px] rounded-full cursor-pointer transition 
                duration-300 ease-out ${
                  isSelected ? "shadow-colorPicker" : "shadow-inner"
                } `}
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
    </AnimationWrapper>
  );
}
