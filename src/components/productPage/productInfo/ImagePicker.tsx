"use client";

import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { useRef, useState } from "react";
import { Modal, ModalContent, useDisclosure } from "@heroui/react";

import IconButton from "@/components/shared/buttons/IconButton";
import IconClose from "@/components/shared/icons/IconCLose";

interface ImagePickerProps {
  photos: { url: string; alt?: string }[];
}

export default function ImagePicker({ photos }: ImagePickerProps) {
  const screenWidth = useScreenWidth();
  const isDesktop = screenWidth >= 1024;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryRef = useRef<ImageGallery | null>(null);

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
  };

  const handleImageClick = () => {
    onOpen();
  };

  return (
    <>
      <div
        id="all"
        className="gallery-container w-full max-w-[380px] tab:max-w-[514px] tabxl:max-w-[617px] tabxl:w-[calc(50%-40px)] desk:w-[calc(50%-60px)] mx-auto tabxl:mx-0 mb-8 tabxl:mb-0 scroll-mt-[142px] tabxl:scroll-mt-[173px]"
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

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{ wrapper: "z-[100]", closeButton: "hidden" }}
        className="fullscreen-modal"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: 0,
          zIndex: 9999,
          backgroundColor: "white",
          overflow: "hidden",
        }}
      >
        <ModalContent
          className="w-full h-full p-0 m-0 max-w-full max-h-full rounded-none"
          style={{ overflow: "hidden" }}
        >
          {(onClose) => (
            <>
              <div className="relative w-full h-full">
                <IconButton
                  handleClick={onClose}
                  className="absolute z-[100] top-10 right-10 text-black laptop:hover:text-yellow focus-visible:text-yellow transition duration-300 ease-in-out"
                >
                  <IconClose className="size-5 desk:size-8 rotate-45" />
                </IconButton>

                <div className="h-full overflow-hidden">
                  <ImageGallery
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
                    onSlide={handleSlide}
                    additionalClass="fullscreen"
                  />
                </div>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
