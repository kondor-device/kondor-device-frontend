import { LandingImage } from "@/types/productItem";
import LandingPicture from "./LandingPicture";

// The whole header (background, logo, title, photo, characteristics) is one picture from the admin
export default function LandingHero({ image }: { image: LandingImage }) {
  return (
    <div className="overflow-hidden rounded-[24px] tab:rounded-[40px] deskxl:rounded-[58px]">
      <LandingPicture image={image} sizes="(min-width: 1920px) 1440px, 100vw" />
    </div>
  );
}
