import { LandingImage } from "@/types/productItem";
import LandingBackdrop, { BACKDROP_ROUNDED } from "./LandingBackdrop";
import LandingPicture from "./LandingPicture";
import { heroGradient, heroMobileGradient } from "./utils";

interface LandingHeroProps {
  /** Picture from 640px (also the mobile one when there is no mobile picture) */
  image: LandingImage;
  /** Picture for screens narrower than 640px */
  mobileImage?: LandingImage | null;
  /** Four colours of the background gradient */
  gradientColors: (string | null)[];
  /** Four colours of the gradient for screens narrower than 640px (optional) */
  mobileGradientColors?: (string | null)[];
}

// Below 640px the picture is as wide as the screen (it leaves the side paddings of the container)
const MOBILE_PICTURE = "mx-[calc(50%-50vw)] w-screen sm:mx-0 sm:w-full";

// The header: a gradient over the whole screen width, the picture (logo, title, photo,
// characteristics) inside the ordinary site container
export default function LandingHero({
  image,
  mobileImage,
  gradientColors,
  mobileGradientColors,
}: LandingHeroProps) {
  const hasMobileGradient = Boolean(mobileGradientColors?.some(Boolean));

  return (
    <div className="relative isolate">
      {hasMobileGradient ? (
        <>
          <LandingBackdrop
            background={heroMobileGradient(mobileGradientColors ?? [])}
            className={`${BACKDROP_ROUNDED} overflow-hidden sm:hidden`}
          />
          <LandingBackdrop
            background={heroGradient(gradientColors)}
            className={`${BACKDROP_ROUNDED} hidden overflow-hidden sm:block`}
          />
        </>
      ) : (
        <LandingBackdrop
          background={heroGradient(gradientColors)}
          className={`${BACKDROP_ROUNDED} overflow-hidden`}
        />
      )}
      <div className="container max-w-[1920px]">
        {mobileImage ? (
          <>
            {/* A hidden lazy image is not downloaded, so only one of the two is loaded */}
            <div className={`${MOBILE_PICTURE} sm:hidden`}>
              <LandingPicture image={mobileImage} sizes="100vw" />
            </div>
            <div className="hidden sm:block">
              <LandingPicture
                image={image}
                sizes="(min-width: 1920px) 1440px, 100vw"
              />
            </div>
          </>
        ) : (
          <div className={MOBILE_PICTURE}>
            <LandingPicture
              image={image}
              sizes="(min-width: 1920px) 1440px, 100vw"
            />
          </div>
        )}
      </div>
    </div>
  );
}
