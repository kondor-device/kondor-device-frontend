import { LandingImage } from "@/types/productItem";
import LandingPicture from "./LandingPicture";

interface LandingHeroProps {
  /** Tablet and desktop picture (also the mobile one when there is no mobile picture) */
  image: LandingImage;
  /** Picture for screens narrower than 768px */
  mobileImage?: LandingImage | null;
}

// The whole header (background, logo, title, photo, characteristics) is one picture from the admin
export default function LandingHero({ image, mobileImage }: LandingHeroProps) {
  return (
    <div className="overflow-hidden rounded-[24px] tab:rounded-[40px] deskxl:rounded-[58px]">
      {mobileImage ? (
        <>
          {/* A hidden lazy image is not downloaded, so only one of the two is loaded */}
          <LandingPicture
            image={mobileImage}
            sizes="100vw"
            className="tab:hidden"
          />
          <LandingPicture
            image={image}
            sizes="(min-width: 1920px) 1440px, 100vw"
            className="hidden tab:block"
          />
        </>
      ) : (
        <LandingPicture
          image={image}
          sizes="(min-width: 1920px) 1440px, 100vw"
        />
      )}
    </div>
  );
}
