import { LandingTextBlock } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import TextContent, { Badges } from "./TextContent";

interface LandingTextImageProps {
  block: LandingTextBlock;
  /** Photo in a rounded frame instead of a free-standing one */
  framed?: boolean;
  /** Badges under the photo instead of under the text */
  badgesUnderImage?: boolean;
}

// Text on the left, photo on the right
export default function LandingTextImage({
  block,
  framed = false,
  badgesUnderImage = false,
}: LandingTextImageProps) {
  return (
    <div className="py-10 tab:py-[70px] desk:py-[99px]">
      <div
        className={[
          "grid items-center gap-8 tab:gap-10 laptop:gap-[80px] deskxl:gap-[120px]",
          framed ? "tab:grid-cols-[1fr_1.3fr]" : "tab:grid-cols-[1fr_1.15fr]",
        ].join(" ")}
      >
        <TextContent
          block={block}
          textClass="text-fg"
          withBadges={!badgesUnderImage}
        />
        {block.image ? (
          <div className="flex flex-col gap-5 deskxl:gap-[29px]">
            <LandingPicture
              image={block.image}
              sizes="(min-width: 768px) 55vw, 100vw"
              className={framed ? "rounded-[16px] deskxl:rounded-[28px]" : undefined}
            />
            {badgesUnderImage ? <Badges block={block} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
