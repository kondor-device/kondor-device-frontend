import { LandingTextBlock } from "@/types/productItem";
import Sparkles from "./Sparkles";
import { FALLBACK_ACCENT, hasText } from "./utils";

// One badge size for the whole landing (text blocks, ribbon, header): font and side paddings,
// plus the height as a fixed or a minimal value for badges whose text may wrap.
export const BADGE_TEXT_CLASS =
  "rounded-full font-actay text-[11px] tab:text-[10px] laptop:text-[12px] deskxl:text-[14px] uppercase";

export const BADGE_PADDING_CLASS = "px-4 tab:px-3 laptop:px-4 deskxl:px-[22px]";

export const BADGE_HEIGHT_CLASS =
  "h-[40px] tab:h-[32px] laptop:h-[46px] deskxl:h-[53px]";

export const BADGE_MIN_HEIGHT_CLASS =
  "min-h-[40px] tab:min-h-[32px] laptop:min-h-[46px] deskxl:min-h-[53px]";

export const BADGE_CLASS = `flex items-center ${BADGE_HEIGHT_CLASS} ${BADGE_PADDING_CLASS} ${BADGE_TEXT_CLASS} text-white whitespace-nowrap`;

export function Badges({
  block,
  className,
}: {
  block: LandingTextBlock;
  className?: string;
}) {
  const badges = (block.badges ?? []).filter((item) => hasText(item.text));

  if (badges.length === 0) return null;

  return (
    <ul
      className={[
        "flex flex-wrap items-center gap-3 tab:gap-2 laptop:gap-3 deskxl:gap-[22px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {badges.map((item, index) => (
        <li
          key={index}
          className={BADGE_CLASS}
          style={{ backgroundColor: block.accentColor ?? FALLBACK_ACCENT }}
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
}

interface TextContentProps {
  block: LandingTextBlock;
  /** Text colour: follows the site theme on light blocks, white on dark ones */
  textClass: string;
  /** Badges under the text (the first block shows them under the photo instead) */
  withBadges?: boolean;
  /** Max width of the description on desktop */
  descriptionWidthClass?: string;
}

export default function TextContent({
  block,
  textClass,
  withBadges = true,
  descriptionWidthClass = "laptop:max-w-[521px]",
}: TextContentProps) {
  return (
    <div className="flex flex-col gap-6 deskxl:gap-[41px] laptop:max-w-[621px]">
      <div
        className={["flex flex-col gap-5 laptop:gap-8", textClass].join(" ")}
      >
        <Sparkles color={block.accentColor ?? FALLBACK_ACCENT} />
        <div className="flex flex-col gap-4 laptop:gap-8">
          {hasText(block.title) ? (
            <h2 className="font-actay uppercase text-[22px] tab:text-[26px] laptop:text-[30px] deskxl:text-[36px] leading-[normal] break-words whitespace-pre-line">
              {block.title}
            </h2>
          ) : null}
          {hasText(block.description) ? (
            <p
              className={`text-[14px] deskxl:text-[16px] leading-[1.5] whitespace-pre-line ${descriptionWidthClass}`}
            >
              {block.description}
            </p>
          ) : null}
        </div>
      </div>
      {withBadges ? <Badges block={block} /> : null}
    </div>
  );
}
