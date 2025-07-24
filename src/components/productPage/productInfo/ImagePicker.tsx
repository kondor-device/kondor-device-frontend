"use client";

import "react-image-gallery/styles/css/image-gallery.css";

import ImageGallery from "react-image-gallery";

interface ImagePickerProps {
  photos: { url: string; alt?: string }[];
}

export default function ImagePicker({ photos }: ImagePickerProps) {
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
      className="w-full max-w-[380px] mx-auto mb-8 tabxl:mb-0 scroll-mt-[142px] tabxl:scroll-mt-[173px]"
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
      />
    </div>
  );
}
