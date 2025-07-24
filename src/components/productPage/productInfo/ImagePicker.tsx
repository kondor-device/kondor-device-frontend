"use client";

import "react-image-gallery/styles/css/image-gallery.css";

import ImageGallery from "react-image-gallery";
import { useScreenWidth } from "@/hooks/useScreenWidth";

interface ImagePickerProps {
  photos: { url: string; alt?: string }[];
}

export default function ImagePicker({ photos }: ImagePickerProps) {
  const screenWidth = useScreenWidth();
  const isDesktop = screenWidth >= 1024;

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

  return (
    <div
      id="all"
      className="w-full max-w-[380px] tab:max-w-[514px] tabxl:max-w-[617px] tabxl:w-[calc(50%-40px)] desk:w-[calc(50%-60px)] mx-auto tabxl:mx-0 mb-8 tabxl:mb-0 scroll-mt-[142px] tabxl:scroll-mt-[173px]"
    >
      <ImageGallery
        items={galleryItems}
        showPlayButton={false}
        showFullscreenButton={true}
        showThumbnails={true}
        useBrowserFullscreen={true}
        showBullets
        slideOnThumbnailOver={true}
        disableThumbnailScroll={false}
        thumbnailPosition={isDesktop ? "left" : "bottom"}
      />
    </div>
  );
}
