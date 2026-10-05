import { LandingTextBlock } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import TextContent from "./TextContent";

// Light block: photo on a dark square on the left, text on the right (section 7)
export default function LandingSquarePhoto({ block }: { block: LandingTextBlock }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1536px] px-5 tab:px-10 laptop:px-[100px] deskxl:px-0 py-6">
        <div className="grid items-center gap-8 tab:grid-cols-2 tab:gap-10 laptop:gap-[80px] deskxl:grid-cols-[640px_621px] deskxl:gap-[96px]">
          <div className="flex aspect-square items-center justify-center rounded-[16px] deskxl:rounded-[28px] bg-[#0a0b10] px-[4%]">
            {block.image ? (
              <LandingPicture
                image={block.image}
                sizes="(min-width: 1920px) 587px, (min-width: 768px) 45vw, 90vw"
              />
            ) : null}
          </div>
          <TextContent block={block} textClass="text-[#0a0b10]" />
        </div>
      </div>
    </div>
  );
}
