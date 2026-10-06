import Image from "next/image";
import { ProductLanding } from "@/types/productItem";
import LandingHeroTitle from "./LandingHeroTitle";
import LandingPicture from "./LandingPicture";
import { FALLBACK_ACCENT, hasText, heroGradient } from "./utils";

type Hero = NonNullable<ProductLanding["hero"]>;

export default function LandingHero({
  hero,
  accentColor,
}: {
  hero: Hero;
  /** Accent colour of the landing (taken from its text blocks) */
  accentColor?: string | null;
}) {
  const badges = (hero.badges ?? []).filter(
    (item) => hasText(item.badge) || hasText(item.text),
  );

  return (
    <div
      className="relative isolate overflow-hidden p-5 tab:p-10 desk:py-[50px] desk:px-[100px] text-white rounded-[24px] tab:rounded-[40px] deskxl:rounded-[58px] laptop:min-h-[calc(32.97vw+200px)] deskxl:min-h-[833px]"
      style={{
        background: heroGradient([
          hero.gradientColor1,
          hero.gradientColor2,
          hero.gradientColor3,
          hero.gradientColor4,
        ]),
      }}
    >
      {/* The dotted texture of the design: the same for every product, under the texts */}
      <Image
        src="/images/landing/halftone.webp"
        alt=""
        aria-hidden="true"
        width={3520}
        height={1330}
        sizes="(min-width: 1920px) 1440px, 100vw"
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-auto w-full select-none opacity-40 invert"
      />

      <div className="flex items-center justify-between">
        <Image
          src="/images/landing/kondor-logo.svg"
          alt="Kondor"
          width={314}
          height={79}
          className="w-[130px] tab:w-[190px] laptop:w-[250px] deskxl:w-[314px] h-auto"
        />
        {hasText(hero.label) ? (
          <span className="flex items-center gap-[22px] font-actay uppercase text-[clamp(14px,2.34vw,45px)] leading-none">
            {/* One star of the sparkles file from the design, in the accent colour; lifted to the middle of the capitals */}
            <span
              aria-hidden="true"
              className="block size-[28px] shrink-0 -translate-y-[0.09em]"
              style={{
                backgroundColor: accentColor ?? FALLBACK_ACCENT,
                mask: "url(/images/landing/sparkles.svg) no-repeat left center / auto 100%",
                WebkitMask:
                  "url(/images/landing/sparkles.svg) no-repeat left center / auto 100%",
              }}
            />
            {hero.label}
          </span>
        ) : null}
      </div>

      {hasText(hero.model) ? (
        <LandingHeroTitle>{hero.model}</LandingHeroTitle>
      ) : null}

      <div className="mt-6 grid tab:grid-cols-2 items-center gap-6 tab:gap-10">
        <div className="relative z-20">
          {hasText(hero.description) ? (
            <p className="mt-3 tab:mt-4 max-w-[17em] text-[clamp(12px,1.406vw,27px)] leading-[1.25] uppercase opacity-80">
              {hero.description}
            </p>
          ) : null}
          {badges.length > 0 ? (
            <ul className="mt-6 tab:mt-10 flex flex-col gap-3">
              {badges.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 deskxl:gap-5"
                >
                  {hasText(item.badge) ? (
                    <span className="flex h-[clamp(36px,4.02vw,77px)] min-w-[clamp(44px,4.05vw,78px)] items-center justify-center rounded-full bg-white px-[clamp(14px,1.8vw,34px)] font-actay text-[clamp(14px,1.667vw,32px)] leading-none text-dark">
                      {item.badge}
                    </span>
                  ) : null}
                  {hasText(item.text) ? (
                    <span className="text-[clamp(10px,0.833vw,16px)] uppercase opacity-80">
                      {item.text}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {hero.image ? (
          // From 1280px the photo is over the title and flush with the bottom of the header: 968×633 with a 100px right offset at 1920px, proportionally smaller below
          <div className="-mb-5 tab:-mb-10 laptop:absolute laptop:bottom-0 laptop:right-[5.21vw] deskxl:right-[100px] laptop:z-10 laptop:mb-0 laptop:w-[50.42vw] deskxl:w-[968px] pointer-events-none">
            <LandingPicture
              image={hero.image}
              sizes="(min-width: 1280px) 968px, (min-width: 768px) 50vw, 100vw"
              className="laptop:aspect-[968/633] laptop:object-contain laptop:object-bottom"
              priority={false}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
