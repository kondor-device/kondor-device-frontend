import { ProductLanding } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import { hasText } from "./utils";

type Steps = NonNullable<ProductLanding["steps"]>;

export default function LandingSteps({ steps }: { steps: Steps }) {
  const items = (steps.items ?? []).filter(
    (item) => hasText(item.title) || hasText(item.description),
  );

  return (
    <div className="relative overflow-hidden bg-white text-[#221f1f]">
      <div className="mx-auto max-w-[1536px] px-5 tab:px-10 laptop:px-[100px] deskxl:px-0 py-10 tab:py-[70px] deskxl:py-[111px]">
        <ol className="flex flex-col gap-6 tab:gap-10 deskxl:gap-[86px] tab:w-1/2 deskxl:w-[742.5px]">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-4 tab:gap-6 deskxl:gap-14">
              <span className="shrink-0 flex items-center justify-center size-[56px] tab:size-[80px] deskxl:size-[121.5px] rounded-full bg-[#0a0b10] text-white font-actay text-[24px] tab:text-[36px] deskxl:text-[56px]">
                {index + 1}
              </span>
              <div className="flex flex-col gap-3 deskxl:gap-6">
                {hasText(item.title) ? (
                  <h3 className="font-actay uppercase text-[16px] tab:text-[20px] deskxl:text-[26px] leading-[normal]">
                    {item.title}
                  </h3>
                ) : null}
                {hasText(item.description) ? (
                  <p className="text-[14px] deskxl:text-[16px] leading-[1.5] whitespace-pre-line">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
      {steps.image ? (
        // The photo bleeds off the right edge of the section
        <div className="px-5 pb-10 tab:absolute tab:right-[-4%] tab:top-1/2 tab:w-[48%] tab:-translate-y-1/2 tab:p-0">
          <LandingPicture
            image={steps.image}
            sizes="(min-width: 768px) 48vw, 100vw"
          />
        </div>
      ) : null}
    </div>
  );
}
