import { LandingImage } from "@/types/productItem";
import LandingPicture from "./LandingPicture";

export default function LandingBanner({ image }: { image: LandingImage }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1536px] px-5 tab:px-10 laptop:px-[100px] deskxl:px-0 py-6 deskxl:py-[24px]">
        <LandingPicture
          image={image}
          sizes="(min-width: 1920px) 1536px, 100vw"
          className="rounded-[16px] deskxl:rounded-[28px]"
        />
      </div>
    </div>
  );
}
