import { LandingStepsBlock } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import { hasText } from "./utils";

export default function LandingSteps({ steps }: { steps: LandingStepsBlock }) {
  const items = (steps.items ?? []).filter(
    (item) => hasText(item.title) || hasText(item.description),
  );

  return (
    <div className="relative py-10 tab:py-[70px] laptop:flex laptop:min-h-[564px] desk:min-h-[672px] laptop:items-center laptop:pb-[150px] laptop:pt-[114px] text-fg">
      <div className="grid items-center gap-8 tab:grid-cols-2 tab:gap-10 laptop:block">
        <ol className="flex flex-col gap-6 tab:gap-10 laptop:max-w-[742px] laptop:gap-[86px]">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-4 tab:gap-6 laptop:gap-14"
            >
              <span className="shrink-0 flex items-center justify-center size-[56px] tab:size-[60px] laptop:size-[121.5px] rounded-full bg-[#0a0b10] text-white font-actay text-[24px] tab:text-[26px] laptop:text-[56px]">
                {index + 1}
              </span>
              <div className="flex flex-col gap-3 laptop:gap-6">
                {hasText(item.title) ? (
                  <h3 className="font-actay uppercase text-[16px] tab:text-[20px] laptop:text-[26px] leading-[normal]">
                    {item.title}
                  </h3>
                ) : null}
                {hasText(item.description) ? (
                  <p className="text-[14px] laptop:text-[16px] leading-[1.5] whitespace-pre-line">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        {steps.image ? (
          // From 1280px the photo is 680×564 (810×672 from 1550px) and sticks to the right edge of the screen
          <div className="tab:w-[136%] tab:max-w-none tab:translate-x-[2%] laptop:translate-x-0 laptop:absolute laptop:right-[calc(50%-50vw-260px)] desk:right-[calc(50%-50vw-140px)] laptop:top-1/2 laptop:h-[564px] laptop:w-[680px] desk:h-[672px] desk:w-[810px] laptop:-translate-y-1/2">
            <LandingPicture
              image={steps.image}
              sizes="(min-width: 1550px) 810px, (min-width: 1280px) 680px, (min-width: 768px) 50vw, 100vw"
              className="laptop:h-full laptop:object-contain"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
