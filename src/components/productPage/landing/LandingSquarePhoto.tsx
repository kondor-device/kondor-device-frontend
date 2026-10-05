import { LandingTextBlock } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import TextContent from "./TextContent";

// Photo on a dark square on the left, text on the right
export default function LandingSquarePhoto({
  block,
}: {
  block: LandingTextBlock;
}) {
  return (
    <div className="py-6 tab:py-8">
      <div className="grid items-center gap-8 tab:grid-cols-2 tab:gap-10 laptop:gap-[80px] deskxl:gap-[96px]">
        <div className="flex aspect-square w-full max-w-[640px] items-center justify-center rounded-[16px] deskxl:rounded-[28px] bg-[#0a0b10] px-[4%]">
          {block.image ? (
            <LandingPicture
              image={block.image}
              sizes="(min-width: 1920px) 587px, (min-width: 768px) 45vw, 90vw"
            />
          ) : null}
        </div>
        <TextContent block={block} textClass="text-fg" />
      </div>
    </div>
  );
}
