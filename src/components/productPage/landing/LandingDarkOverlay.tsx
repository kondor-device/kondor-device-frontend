import { LandingTextBlock } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import TextContent from "./TextContent";

// Dark rounded card: the photo bleeds off the left edge of the card, the text is on the right
export default function LandingDarkOverlay({
  block,
}: {
  block: LandingTextBlock;
}) {
  return (
    <div className="my-4 tab:my-6 relative overflow-hidden rounded-[24px] tab:rounded-[40px] deskxl:rounded-[58px] bg-[#0a0b10]">
      {block.image ? (
        <div className="relative tab:absolute tab:left-[-6%] tab:top-1/2 tab:w-[52%] tab:-translate-y-1/2">
          <LandingPicture
            image={block.image}
            sizes="(min-width: 768px) 52vw, 100vw"
          />
        </div>
      ) : null}
      <div className="px-5 tab:pl-0 tab:pr-10 deskxl:pr-[100px] py-10 tab:py-[70px] deskxl:py-[130px]">
        <div className="tab:ml-[52%] laptop:ml-[50%]">
          <TextContent block={block} textClass="text-white" />
        </div>
      </div>
    </div>
  );
}
