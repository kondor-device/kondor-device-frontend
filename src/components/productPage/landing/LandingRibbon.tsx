import { Fragment } from "react";
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
    // The fill goes edge to edge of the page, the text stays inside the site container
    <div
      data-landing-ribbon
      className="py-5 tab:py-8 deskxl:py-0 deskxl:h-[191px]"
      style={{
        background: gradient(ribbon.gradientFrom, ribbon.gradientTo, 91),
      }}
    >
      <div className="container max-w-[1920px] h-full flex items-center justify-center">
        <ul className="flex flex-col tab:flex-row items-center justify-center gap-3 tab:gap-5 deskxl:gap-8">
          {badges.map((item, index) => (
            <Fragment key={index}>
              {index > 0 ? (
                <li
                  aria-hidden="true"
                  className="size-4 tab:size-6 deskxl:size-[40px] rounded-full bg-white"
                />
              ) : null}
              <li>
                <span
                  className={`flex items-center justify-center py-1 text-center bg-white text-[#0a0b10] px-6 tab:px-5 laptop:px-6 deskxl:px-8 ${BADGE_MIN_HEIGHT_CLASS} ${BADGE_TEXT_CLASS}`}
                >
                  {item.text}
                </span>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}
