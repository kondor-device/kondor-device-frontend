import Image from "next/image";
import { ProductLanding } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import {
  BADGE_HEIGHT_CLASS,
  BADGE_PADDING_CLASS,
  BADGE_TEXT_CLASS,
} from "./TextContent";
import { hasText, heroGradient } from "./utils";

type Hero = NonNullable<ProductLanding["hero"]>;

export default function LandingHero({ hero }: { hero: Hero }) {
  const badges = (hero.badges ?? []).filter(
    (item) => hasText(item.badge) || hasText(item.text),
  );

  return (
    <div
      className="p-5 tab:p-10 desk:py-[50px] desk:px-[100px] text-white rounded-[24px] tab:rounded-[40px] deskxl:rounded-[58px]"
      style={{
        background: heroGradient([
          hero.gradientColor1,
          hero.gradientColor2,
          hero.gradientColor3,
          hero.gradientColor4,
        ]),
      }}
    >
      <div className="flex items-center justify-between">
        <Image
          src="/images/landing/kondor-logo.svg"
          alt="Kondor"
          width={314}
          height={79}
          className="w-[130px] tab:w-[190px] laptop:w-[250px] deskxl:w-[314px] h-auto"
        />
        {hasText(hero.label) ? (
          <span className="flex items-center gap-2 text-10bold tab:text-14bold uppercase tracking-wide">
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0c.6 6.6 4.8 11.4 12 12-7.2.6-11.4 5.4-12 12-.6-6.6-4.8-11.4-12-12C7.2 11.4 11.4 6.6 12 0Z" />
            </svg>
            {hero.label}
          </span>
        ) : null}
      </div>

      <div className="mt-6 tab:mt-4 grid tab:grid-cols-2 items-center gap-6 tab:gap-10">
        <div>
          {hasText(hero.model) ? (
            <h2 className="text-[40px] leading-none tab:text-[56px] laptop:text-[80px] desk:text-[96px] font-bold uppercase break-words">
              {hero.model}
            </h2>
          ) : null}
          {hasText(hero.description) ? (
            <p className="mt-3 tab:mt-4 text-12med tab:text-16med max-w-[420px] uppercase opacity-80">
              {hero.description}
            </p>
          ) : null}
          {badges.length > 0 ? (
            <ul className="mt-6 tab:mt-10 flex flex-col gap-3">
              {badges.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  {hasText(item.badge) ? (
                    <span
                      className={`flex items-center justify-center min-w-[56px] bg-white text-dark ${BADGE_HEIGHT_CLASS} ${BADGE_PADDING_CLASS} ${BADGE_TEXT_CLASS}`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                  {hasText(item.text) ? (
                    <span className="text-10med tab:text-12med opacity-80">
                      {item.text}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {hero.image ? (
          <LandingPicture
            image={hero.image}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={false}
          />
        ) : null}
      </div>
    </div>
  );
}
