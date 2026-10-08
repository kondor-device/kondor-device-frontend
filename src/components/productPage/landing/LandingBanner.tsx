import { LandingBannerBlock } from "@/types/productItem";
import LandingBackdrop, { BACKDROP_ROUNDED } from "./LandingBackdrop";
import LandingPicture from "./LandingPicture";
import { bannerGradient } from "./utils";

// Photo in the site container on a gradient that fills the whole width of the page
export default function LandingBanner({
  banner,
}: {
  banner: LandingBannerBlock & {
    image: NonNullable<LandingBannerBlock["image"]>;
  };
}) {
  const hasBackground = Boolean(banner.gradientFrom || banner.gradientTo);

  return (
    <div className="relative isolate">
      {hasBackground ? (
        <LandingBackdrop
          background={bannerGradient(
            banner.gradientFrom,
            banner.gradientTo,
            banner.gradientAngle,
            banner.gradientFromPosition,
            banner.gradientToPosition,
          )}
          className={BACKDROP_ROUNDED}
        />
      ) : null}
      <div className="container max-w-[1920px]">
        <LandingPicture
          image={banner.image}
          sizes="(min-width: 1920px) 1440px, 100vw"
        />
      </div>
    </div>
  );
}
