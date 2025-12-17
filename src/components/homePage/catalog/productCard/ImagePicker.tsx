"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";

interface ImagePickerProps {
  photos: { url: string; alt?: string }[];
  selectedPhotoIndex: number;
  setSelectedPhotoIndex: (index: number) => void;
  productUrl: string;
  badge?: {
    text: string;
    backgroundColor?: {
      hex: string;
    };
  };
}

export default function ImagePicker({
  photos,
  selectedPhotoIndex,
  setSelectedPhotoIndex,
  productUrl,
  badge,
}: ImagePickerProps) {
  const badgeText = badge?.text ?? null;
  const badgeColor = badge?.backgroundColor?.hex ?? null;
  const badgeStyle = badgeColor
    ? { backgroundColor: badgeColor, borderColor: badgeColor }
    : undefined;

  if (!photos || !photos?.length) return null;

  return (
    <div className="flex flex-col deskxl:flex-row deskxl:justify-between gap-y-3 deskxl:gap-x-5 tabxl:max-w-[340px] deskxl:max-w-full h-full deskxl:max-h-[466px]">
      <div
        className="relative flex justify-between items-center max-w-[306px] tabxl:max-w-[340px] tabxl:size-[340px] deskxl:max-w-[466px] deskxl:size-[466px] bg-white 
  aspect-[1/1] rounded-[11px] tabxl:rounded-[40px] overflow-hidden"
      >
        {badgeText ? (
          <div
            className={`absolute z-10 top-1.5 tabxl:top-[14px] left-1.5 tabxl:left-[14px] shrink-0 w-fit py-[7px] px-2.5 tabxl:px-[14px] rounded-full border text-[10px] tabxl:text-[12px] font-semibold leading-[115%] ${
              badgeColor ? "text-white" : "bg-white border-black text-black"
            }`}
            style={badgeStyle}
          >
            {badgeText}
          </div>
        ) : null}
        <Link href={productUrl}>
          <Image
            src={
              photos[selectedPhotoIndex]?.url || "/images/icons/logoSmall.svg"
            }
            alt={photos[selectedPhotoIndex]?.alt || "keyboard"}
            width={1080}
            height={1080}
            className="max-w-full max-h-full object-cover"
          />
        </Link>
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
                className="max-w-full max-h-full object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
