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
    <div
      className="flex laptop:flex-col justify-between items-center w-full max-w-[306px] 
      laptop:max-w-full aspect-[327/257] laptop:w-[349px] laptop:aspect-[1/1] 
      deskxl:w-[449px] laptop:h-[349px] deskxl:h-[449px] 
      p-[15px] laptop:p-6 deskxl:p-[50px] mx-auto bg-white 
      rounded-[11px] laptop:rounded-[40px]"
    >
      <Image
        src={photos[selectedPhotoIndex]?.url}
        alt={photos[selectedPhotoIndex]?.alt || "keyboard"}
        width={1080}
        height={1080}
        className="h-full w-auto laptop:h-[221px] deskxl:h-[242px]"
      />

      <div className="laptop:w-full h-full laptop:h-fit pt-[2px] pb-[2px] pl-[2px] pr-2 laptop:pr-[2px] laptop:pb-2 overflow-auto scrollbar scrollbar-w-[3px] scrollbar-h-[4px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-yellow scrollbar-track-transparent popup-scroll">
        <ul className="flex flex-col laptop:flex-row gap-y-[8px] gap-x-4 deskxl:gap-x-8 w-fit h-fit">
          {photos.map(({ url, alt }, idx) => (
            <li
              key={idx}
              className={`cursor-pointer size-[45px] laptop:size-[62px] deskxl:size-[101px] bg-dark rounded-[2px] 
              laptop:rounded-[6px] overflow-hidden ${
                selectedPhotoIndex === idx ? "shadow-imagePicker" : ""
              }`}
              onClick={() => setSelectedPhotoIndex(idx)}
            >
              <Image
                src={url}
                alt={alt || "keyboard"}
                width={1080}
                height={1080}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
