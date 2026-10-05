import { LandingTextBlock } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import TextContent, { Badges } from "./TextContent";

interface LandingTextImageProps {
  block: LandingTextBlock;
  /** Photo in a rounded frame (section 8) instead of a free-standing one (section 2) */
  framed?: boolean;
  /** Badges under the photo (section 2) instead of under the text */
  badgesUnderImage?: boolean;
}

// Light block: text on the left, photo on the right
export default function LandingTextImage({
  block,
  framed = false,
  badgesUnderImage = false,
}: LandingTextImageProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1536px] px-5 tab:px-10 laptop:px-[100px] deskxl:px-0 py-10 tab:py-[70px] deskxl:py-[110px]">
        <div
          className={[
            "grid items-center gap-8 tab:grid-cols-2 tab:gap-10 laptop:gap-[80px] deskxl:gap-[161px]",
            framed
              ? "deskxl:grid-cols-[621px_863px] deskxl:w-[1645px]"
              : "deskxl:grid-cols-[621px_754px]",
          ].join(" ")}
        >
          <TextContent
            block={block}
            textClass="text-[#221f1f]"
            withBadges={!badgesUnderImage}
          />
          {block.image ? (
            <div className="flex flex-col gap-5 deskxl:gap-[29px]">
              <LandingPicture
                image={block.image}
                sizes="(min-width: 1920px) 863px, (min-width: 768px) 50vw, 100vw"
                className={framed ? "rounded-[16px] deskxl:rounded-[28px]" : undefined}
              />
              {badgesUnderImage ? <Badges block={block} /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
