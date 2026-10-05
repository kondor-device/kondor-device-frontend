import { LandingTextBlock } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import TextContent from "./TextContent";

// Dark rounded card: on mobile the photo is inside the card above the text; from 768px it bleeds off the left edge and the text is on the right
export default function LandingDarkOverlay({
  block,
}: {
  block: LandingTextBlock;
}) {
  return (
    <div className="my-4 tab:my-6 [&:has(+[data-landing-ribbon])]:mb-0 relative overflow-hidden rounded-[24px] tab:rounded-[40px] deskxl:rounded-[58px] bg-[#0a0b10] px-5 py-[60px] tab:p-0">
      {block.image ? (
        <div className="relative mb-8 tab:mb-0 tab:absolute tab:left-[-6%] tab:top-1/2 tab:w-[52%] tab:-translate-y-1/2">
          <LandingPicture
            image={block.image}
            sizes="(min-width: 768px) 52vw, 100vw"
          />
        </div>
      ) : null}
      <div className="tab:pr-10 deskxl:pr-[100px] tab:py-[70px] tabxl:py-[110px] laptop:pb-[145px] laptop:pt-[170px]">
        <div className="tab:ml-[52%] laptop:ml-[50%]">
          <TextContent
            block={block}
            textClass="text-white"
            descriptionWidthClass="laptop:max-w-[621px]"
          />
        </div>
      </div>
    </div>
  );
}
