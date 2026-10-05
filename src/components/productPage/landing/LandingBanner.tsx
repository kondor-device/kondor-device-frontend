import { LandingImage } from "@/types/productItem";
import LandingPicture from "./LandingPicture";

export default function LandingBanner({ image }: { image: LandingImage }) {
  return (
    <div className="px-5 tab:px-10 desk:px-[100px] pb-5 tab:pb-10 desk:pb-[60px] bg-white">
      <LandingPicture
        image={image}
        sizes="100vw"
        className="rounded-[20px] desk:rounded-[30px]"
      />
    </div>
  );
}
