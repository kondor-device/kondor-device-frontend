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
    originalClass: "tabxl:rounded-[8px] overflow-hidden",
    thumbnailClass: "custom-thumbnail",
  }));

  return (
    <div id="all" className="w-full mb-8 tabxl:mb-0">
      <ImageGallery
        items={galleryItems}
        showPlayButton={false}
        showFullscreenButton={true}
        showThumbnails={true}
        useBrowserFullscreen={true}
        slideOnThumbnailOver={true}
        disableThumbnailScroll={false}
      />
    </div>
  );
}
