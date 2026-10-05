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
    <div
      className="my-4 tab:my-6 px-5 py-5 tab:py-8 deskxl:h-[191px] deskxl:py-0 flex items-center justify-center rounded-[24px] tab:rounded-[40px] deskxl:rounded-[58px]"
      style={{
        background: gradient(ribbon.gradientFrom, ribbon.gradientTo, 91),
      }}
    >
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
              className={`flex items-center justify-center py-1 text-center bg-white text-[#0a0b10] ${BADGE_MIN_HEIGHT_CLASS} ${BADGE_TEXT_CLASS}`}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
