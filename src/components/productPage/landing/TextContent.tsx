import { LandingTextBlock } from "@/types/productItem";
import Sparkles from "./Sparkles";
import { FALLBACK_ACCENT, hasText } from "./utils";

export const BADGE_CLASS =
  "flex items-center h-[40px] tab:h-[46px] deskxl:h-[53px] px-4 deskxl:px-[22px] rounded-full text-white font-actay text-[11px] tab:text-[12px] deskxl:text-[14px] uppercase whitespace-nowrap";

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
        "flex flex-wrap items-center gap-3 deskxl:gap-[22px]",
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
}

export default function TextContent({
  block,
  textClass,
  withBadges = true,
}: TextContentProps) {
  return (
    <div className="flex flex-col gap-6 deskxl:gap-[41px] tab:max-w-[621px]">
      <div
        className={["flex flex-col gap-5 desk:gap-8", textClass].join(" ")}
      >
        <Sparkles color={block.accentColor ?? FALLBACK_ACCENT} />
        <div className="flex flex-col gap-4 desk:gap-8">
          {hasText(block.title) ? (
            <h2 className="font-actay uppercase text-[22px] tab:text-[26px] laptop:text-[30px] deskxl:text-[36px] leading-[normal] break-words">
              {block.title}
            </h2>
          ) : null}
          {hasText(block.description) ? (
            <p className="text-[14px] deskxl:text-[16px] leading-[1.5] whitespace-pre-line tab:max-w-[521px]">
              {block.description}
            </p>
          ) : null}
        </div>
      </div>
      {withBadges ? <Badges block={block} /> : null}
    </div>
  );
}
