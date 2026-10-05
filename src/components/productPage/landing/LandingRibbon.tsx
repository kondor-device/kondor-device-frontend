import { LandingRibbonBlock } from "@/types/productItem";
import { BADGE_MIN_HEIGHT_CLASS, BADGE_TEXT_CLASS } from "./TextContent";
import { gradient, hasText } from "./utils";

export default function LandingRibbon({
  ribbon,
}: {
  ribbon: LandingRibbonBlock;
}) {
  const badges = (ribbon.badges ?? []).filter((item) => hasText(item.text));

  return (
    // The fill goes edge to edge of the screen, the text stays inside the site container
    <div
      data-landing-ribbon
      className="mx-[calc(50%-50vw)] py-5 tab:py-8 deskxl:py-0 deskxl:h-[191px]"
      style={{
        background: gradient(ribbon.gradientFrom, ribbon.gradientTo, 91),
      }}
    >
      <div className="container max-w-[1920px] h-full flex items-center justify-center">
        <ul className="flex flex-wrap items-center justify-center gap-3 tab:gap-5 deskxl:gap-8">
          {badges.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 tab:gap-5 deskxl:gap-8"
            >
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="hidden tab:block size-6 deskxl:size-[40px] rounded-full bg-white"
                />
              ) : null}
              <span
                className={`flex items-center justify-center py-1 text-center bg-white text-[#0a0b10] px-6 tab:px-5 laptop:px-6 deskxl:px-8 ${BADGE_MIN_HEIGHT_CLASS} ${BADGE_TEXT_CLASS}`}
              >
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
