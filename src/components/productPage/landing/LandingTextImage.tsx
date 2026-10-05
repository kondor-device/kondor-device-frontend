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
          <div
            className={[
              "flex flex-col gap-5 deskxl:gap-[29px]",
              // On desktop the free-standing photo stops growing at 630×399
              framed ? "" : "desk:w-[630px]",
            ].join(" ")}
          >
            <LandingPicture
              image={block.image}
              sizes={
                framed
                  ? "(min-width: 768px) 55vw, 100vw"
                  : "(min-width: 1550px) 630px, (min-width: 768px) 55vw, 100vw"
              }
              className={
                framed
                  ? "rounded-[16px] deskxl:rounded-[28px]"
                  : "desk:h-[399px] object-contain"
              }
            />
            {badgesUnderImage ? <Badges block={block} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
