"use client";

import Image from "next/image";
import React from "react";

interface ImagePickerProps {
  photos: { url: string; alt?: string }[];
  selectedPhotoIndex: number;
  setSelectedPhotoIndex: (index: number) => void;
}

export default function ImagePicker({
  photos,
  selectedPhotoIndex,
  setSelectedPhotoIndex,
}: ImagePickerProps) {
  return (
    <div className="flex flex-col deskxl:flex-row deskxl:justify-between gap-y-3 deskxl:gap-x-5 tabxl:max-w-[340px] deskxl:max-w-full h-full deskxl:max-h-[466px]">
      <div
        className="flex justify-between items-center max-w-[306px] tabxl:max-w-[340px] tabxl:size-[340px] deskxl:max-w-[466px] deskxl:size-[466px] bg-white 
  aspect-[1/1] rounded-[11px] tabxl:rounded-[40px] overflow-hidden"
      >
        <Image
          src={photos[selectedPhotoIndex]?.url || "/images/icons/logoSmall.svg"}
          alt={photos[selectedPhotoIndex]?.alt || "keyboard"}
          width={1080}
          height={1080}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div
        className="w-full h-fit deskxl:w-fit deskxl:h-[466px] pt-[2px] pb-2 pl-[2px] pr-[2px] tabxl:pr-2 tabxl:pb-2 overflow-x-auto deskxl:overflow-x-visible deskxl:overflow-y-auto scrollbar 
  scrollbar-w-[2px] scrollbar-h-[2px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-yellow scrollbar-track-transparent popup-scroll"
      >
        <ul className="flex flex-row deskxl:flex-col gap-y-4 gap-x-4 deskxl:gap-y-[35px] w-fit h-fit mx-auto my-auto">
          {photos.map(({ url, alt }, idx) => (
            <li
              key={idx}
              className={`cursor-pointer flex items-center justify-center size-[46px] tabxl:size-[62px] deskxl:size-[60px] bg-white rounded-[2px] 
          tabxl:rounded-[6px] overflow-hidden ${
            selectedPhotoIndex === idx ? "shadow-imagePicker" : ""
          }`}
              onClick={() => setSelectedPhotoIndex(idx)}
            >
              <Image
                src={url || "/images/icons/logoSmall.svg"}
                alt={alt || "keyboard"}
                width={1080}
                height={1080}
                className="max-w-full max-h-full object-contain"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
