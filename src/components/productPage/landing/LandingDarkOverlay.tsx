import { LandingTextBlock } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import TextContent from "./TextContent";

// Dark rounded card: the photo bleeds off the left edge, the text is on the right (section 3)
export default function LandingDarkOverlay({ block }: { block: LandingTextBlock }) {
  return (
    <div className="bg-white">
      <div className="relative overflow-hidden rounded-[24px] tab:rounded-[40px] deskxl:rounded-[58px] bg-[#0a0b10]">
        {block.image ? (
          <div className="relative tab:absolute tab:left-[-6%] tab:top-1/2 tab:w-[52%] tab:-translate-y-1/2">
            <LandingPicture
              image={block.image}
              sizes="(min-width: 768px) 52vw, 100vw"
            />
          </div>
        ) : null}
        <div className="mx-auto max-w-[1536px] px-5 tab:px-10 laptop:px-[100px] deskxl:px-0 py-10 tab:py-[70px] deskxl:py-[170px]">
          <div className="tab:ml-[52%] deskxl:ml-[813px] deskxl:w-[621px]">
            <TextContent block={block} textClass="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
