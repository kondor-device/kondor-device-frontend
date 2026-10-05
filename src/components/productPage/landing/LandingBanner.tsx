import { LandingImage } from "@/types/productItem";
import LandingPicture from "./LandingPicture";

export default function LandingBanner({ image }: { image: LandingImage }) {
  return (
    <div className="py-6">
      <LandingPicture
        image={image}
        sizes="100vw"
        className="rounded-[16px] deskxl:rounded-[28px]"
      />
    </div>
  );
}
