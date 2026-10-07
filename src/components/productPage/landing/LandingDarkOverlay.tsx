import { LandingTextBlock } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import TextContent from "./TextContent";

// Dark rounded block over the whole screen width: on mobile the photo is above the text; from 768px
// it bleeds off the left edge of the screen and the text (inside the site container) is on the right
export default function LandingDarkOverlay({
  block,
}: {
  block: LandingTextBlock;
}) {
  return (
    // The block is as wide as the page; its text is in the site container (so it lines up with the
    // rest of the page), the dark fill is a layer behind it
    <div className="relative isolate my-4 tab:my-6 [&:has(+[data-landing-ribbon])]:mb-0 py-[60px] tab:py-0">
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-[24px] tab:rounded-[40px] deskxl:rounded-[58px] bg-[#0a0b10]">
        {block.image ? (
          <div className="absolute left-[-6%] top-1/2 hidden w-[52%] -translate-y-1/2 tab:block">
            <LandingPicture
              image={block.image}
              sizes="(min-width: 768px) 52vw, 100vw"
            />
          </div>
        ) : null}
      </div>
      <div className="container max-w-[1920px]">
        {block.image ? (
          <div className="mb-8 tab:hidden">
            <LandingPicture image={block.image} sizes="100vw" />
          </div>
        ) : null}
        <div className="tab:py-[70px] tabxl:py-[110px] laptop:pb-[145px] laptop:pt-[170px]">
          <div className="tab:ml-[52%] laptop:ml-[50%]">
            <TextContent
              block={block}
              textClass="text-white"
              descriptionWidthClass="laptop:max-w-[579px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
