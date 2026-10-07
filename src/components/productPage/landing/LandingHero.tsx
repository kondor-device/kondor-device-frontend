import { LandingImage } from "@/types/productItem";
import LandingBackdrop from "./LandingBackdrop";
import LandingPicture from "./LandingPicture";
import { heroGradient } from "./utils";

interface LandingHeroProps {
  /** Picture from 640px (also the mobile one when there is no mobile picture) */
  image: LandingImage;
  /** Picture for screens narrower than 640px */
  mobileImage?: LandingImage | null;
  /** Four colours of the background gradient */
  gradientColors: (string | null)[];
}

// The header: a gradient over the whole screen width, the picture (logo, title, photo,
// characteristics) inside the site container
export default function LandingHero({
  image,
  mobileImage,
  gradientColors,
}: LandingHeroProps) {
  return (
    <div className="relative isolate">
      <LandingBackdrop background={heroGradient(gradientColors)} />
      {mobileImage ? (
        <>
          {/* A hidden lazy image is not downloaded, so only one of the two is loaded */}
          <LandingPicture
            image={mobileImage}
            sizes="100vw"
            className="sm:hidden"
          />
          <LandingPicture
            image={image}
            sizes="(min-width: 1920px) 1440px, 100vw"
            className="hidden sm:block"
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
