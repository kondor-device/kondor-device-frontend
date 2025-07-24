"use client";

import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import IconButton from "@/components/shared/buttons/IconButton";
import IconClose from "@/components/shared/icons/IconCLose";
import clsx from "clsx";

interface ImagePickerProps {
  photos: { url: string; alt?: string }[];
}

export default function ImagePicker({ photos }: ImagePickerProps) {
  const screenWidth = useScreenWidth();
  const isDesktop = screenWidth >= 1024;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const galleryRef = useRef<ImageGallery | null>(null);
  const fullscreenGalleryRef = useRef<ImageGallery | null>(null);

  const galleryItems = photos.map((photo) => ({
    original: photo.url,
    thumbnail: photo.url,
    originalAlt: photo.alt || "image",
    thumbnailAlt: photo.alt || "thumbnail",
    thumbnailHeight: 48,
    thumbnailWidth: 48,
    originalClass:
      "rounded-[8px] tabxl:rounded-[12px] overflow-hidden px-[1px]",
    thumbnailClass: "custom-thumbnail",
  }));

  const handleSlide = (index: number) => {
    setCurrentIndex(index);
    if (galleryRef.current && fullscreenGalleryRef.current) {
      fullscreenGalleryRef.current.slideToIndex(index);
    }
  };

  const handleFullscreenSlide = (index: number) => {
    setCurrentIndex(index);
    if (galleryRef.current && fullscreenGalleryRef.current) {
      galleryRef.current.slideToIndex(index);
    }
  };

  const handleImageClick = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <>
      <div
        className={clsx(
          "gallery-container",
          "w-full max-w-[380px] tab:max-w-[514px] tabxl:max-w-[617px] tabxl:w-[calc(50%-40px)] desk:w-[calc(50%-60px)] mx-auto tabxl:mx-0 mb-8 tabxl:mb-0 scroll-mt-[142px] tabxl:scroll-mt-[173px]"
        )}
      >
        <ImageGallery
          ref={(ref) => {
            galleryRef.current = ref;
          }}
          items={galleryItems}
          showPlayButton={false}
          showFullscreenButton={false}
          showThumbnails={true}
          useBrowserFullscreen={false}
          showBullets={false}
          slideOnThumbnailOver={true}
          disableThumbnailScroll={false}
          thumbnailPosition={isDesktop ? "left" : "bottom"}
          startIndex={currentIndex}
          onSlide={handleSlide}
          onClick={handleImageClick}
          additionalClass=""
        />
      </div>

      {isClient &&
        isFullscreen &&
        createPortal(
          <div
            className={clsx(
              "fixed inset-0 z-[80] bg-white flex items-center justify-center no-doc-scroll",
              isFullscreen ? "block" : "hidden"
            )}
          >
            <div className="relative w-full h-full">
              <IconButton
                handleClick={closeFullscreen}
                className="absolute z-[100] top-10 right-10 text-black laptop:hover:text-yellow focus-visible:text-yellow transition duration-300 ease-in-out"
              >
                <IconClose className="size-5 desk:size-8 rotate-45" />
              </IconButton>

              <div className="h-full overflow-hidden">
                <ImageGallery
                  ref={(ref) => {
                    fullscreenGalleryRef.current = ref;
                  }}
                  items={galleryItems}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  showThumbnails={false}
                  useBrowserFullscreen={false}
                  showBullets={true}
                  slideOnThumbnailOver={true}
                  disableThumbnailScroll={false}
                  thumbnailPosition={isDesktop ? "left" : "bottom"}
                  startIndex={currentIndex}
                  onSlide={handleFullscreenSlide}
                  additionalClass="fullscreen"
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
