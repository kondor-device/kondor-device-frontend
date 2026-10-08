import Image from "next/image";
import { LandingImage } from "@/types/productItem";
import { getImageSize } from "./utils";

interface LandingPictureProps {
  image: LandingImage;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export default function LandingPicture({
  image,
  sizes,
  className,
  priority,
}: LandingPictureProps) {
  const { width, height } = getImageSize(image);

  return (
    <Image
      src={image.url}
      alt={image.alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={["w-full h-auto", className].filter(Boolean).join(" ")}
    />
  );
}
