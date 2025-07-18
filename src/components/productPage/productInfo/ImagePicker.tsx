"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import Backdrop from "@/components/shared/header/catalogMenu/Backdrop";
import IconButton from "@/components/shared/buttons/IconButton";
import IconClose from "@/components/shared/icons/IconCLose";
import { useSwipeable } from "react-swipeable";

interface ImagePickerProps {
  photos: { url: string; alt?: string }[];
  selectedPhotoIndex: number;
  setSelectedPhotoIndex: Dispatch<SetStateAction<number>>;
}

export default function ImagePicker({
  photos,
  selectedPhotoIndex,
  setSelectedPhotoIndex,
}: ImagePickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const next = () => {
    setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prev = () => {
    setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  return (
    <div
      className="flex flex-col items-center tabxl:flex-row-reverse tabxl:justify-end gap-y-3 tabxl:gap-x-10 mb-8 laptop:mb-0"
      {...swipeHandlers}
    >
      <div className="relative flex justify-center">
        <div
          className="flex justify-between items-center max-w-[306px] tabxl:max-w-[448px] laptop:size-[448px] bg-white 
  aspect-[1/1] rounded-[40px] overflow-hidden"
        >
          <Image
            src={
              photos[selectedPhotoIndex]?.url || "/images/icons/logoSmall.svg"
            }
            alt={photos[selectedPhotoIndex]?.alt || "keyboard"}
            width={1080}
            height={1080}
            onClick={() => setIsModalOpen(true)}
            className="max-w-full max-h-full object-cover cursor-pointer laptop:hover:scale-110 transition duration-1000 ease-slow"
          />
        </div>

        {/* Навігація */}
        <button
          onClick={prev}
          className="absolute top-[calc(50%-10px)] desk:top-[calc(50%-20px)] -left-5 desk:-left-10 flex items-center justify-center size-5 desk:size-10  cursor-pointer active:scale-95 transition duration-300 ease-in-out"
        >
          <Image
            src="/images/icons/arrow-left.svg"
            alt="arrow icon"
            width={40}
            height={40}
            className="size-5 desk:size-10"
          />
        </button>
        <button
          onClick={next}
          className="absolute top-[calc(50%-10px)] desk:top-[calc(50%-20px)] -right-5 desk:-right-10 flex items-center justify-center size-5 desk:size-10 cursor-pointer active:scale-95 transition duration-300 ease-in-out"
        >
          <Image
            src="/images/icons/arrow-left.svg"
            alt="arrow icon"
            width={40}
            height={40}
            className="rotate-180 size-5 desk:size-10"
          />
        </button>
      </div>

      <div
        className="shrink-0 w-full h-fit tabxl:w-fit tabxl:h-[360px] laptop:h-[448px] pt-[2px] pb-2 pl-[2px] pr-[2px] tabxl:pr-2 tabxl:pb-2 tab:overflow-x-auto tab:overflow-y-visible overflow-y-auto scrollbar 
  scrollbar-w-[2px] scrollbar-h-[2px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-yellow/30 scrollbar-track-transparent popup-scroll"
      >
        <ul className="flex flex-row tabxl:flex-col gap-y-3 gap-x-3 deskxl:gap-y-[35px] w-fit h-fit mx-auto my-auto">
          {photos.map(({ url, alt }, idx) => (
            <li
              key={idx}
              className={`cursor-pointer flex items-center justify-center size-[78px] laptop:size-[100px] bg-white rounded-[4px] 
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
                className="max-w-full max-h-full object-cover laptop:hover:scale-110 transition duration-1000 ease-slow"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Модалка зі збільшеним фото */}
      <div
        className={`fixed z-[80] left-1/2 bottom-0 transform -translate-x-1/2 w-[90vw] tabxl:w-[75vw] max-w-[1440px] h-[90vh] max-h-[700px] bg-white 
          p-5 desk:p-[70px] rounded-[20px] desk:rounded-[30px] shadow-notification ${
            isModalOpen
              ? "opacity-100 -translate-y-[calc(50dvh-50%)]"
              : "opacity-0 translate-y-[50px] tab:translate-y-[100px] pointer-events-none"
          } transition duration-500 ease-slow`}
        {...swipeHandlers}
      >
        {" "}
        <div
          className={`absolute top-4 right-4 tab:top-8 tab:right-8 size-5 tab:size-[25px]`}
        >
          <IconButton
            handleClick={() => setIsModalOpen(false)}
            className="enabled:active:scale-95 enabled:active:text-yellow laptop:enabled:hover:text-yellow enabled:focus-visible:text-yellow transition duration-300 ease-out"
          >
            {<IconClose className="size-full rotate-45" />}
          </IconButton>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative flex justify-center items-center">
            {" "}
            <div className="relative size-[290px] sm:size-[540px] desk:size-[600px] rounded-[40px] desk:rounded-[64px] overflow-hidden">
              <Image
                src={
                  photos[selectedPhotoIndex]?.url ||
                  "/images/icons/logoSmall.svg"
                }
                alt="full-size image"
                fill
                className="object-contain rounded-[40px] desk:rounded-[64px] laptop:hover:scale-110 transition duration-1000 ease-slow"
              />
            </div>{" "}
            <button
              onClick={prev}
              className="absolute top-[calc(50%-10px)] desk:top-[calc(50%-32px)] -left-5 desk:left-[-160px] flex items-center justify-center size-5 desk:size-16  cursor-pointer active:scale-95 transition duration-300 ease-in-out"
            >
              <Image
                src="/images/icons/arrow-left.svg"
                alt="arrow icon"
                width={40}
                height={40}
                className="size-5 desk:size-16"
              />
            </button>
            <button
              onClick={next}
              className="absolute top-[calc(50%-10px)] desk:top-[calc(50%-32px)] -right-5 desk:right-[-160px] flex items-center justify-center size-5 desk:size-16 cursor-pointer active:scale-95 transition duration-300 ease-in-out"
            >
              <Image
                src="/images/icons/arrow-left.svg"
                alt="arrow icon"
                width={40}
                height={40}
                className="rotate-180 size-5 desk:size-16"
              />
            </button>
          </div>
        </div>
      </div>
      <Backdrop isVisible={isModalOpen} onClick={() => setIsModalOpen(false)} />
    </div>
  );
}
