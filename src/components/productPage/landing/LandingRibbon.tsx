import { ProductLanding } from "@/types/productItem";
import { gradient, hasText } from "./utils";

type Ribbon = NonNullable<ProductLanding["ribbon"]>;

export default function LandingRibbon({ ribbon }: { ribbon: Ribbon }) {
  const badges = (ribbon.badges ?? []).filter((item) => hasText(item.text));

  return (
    <div
      className="px-5 py-5 tab:py-8 deskxl:h-[191px] deskxl:py-0 flex items-center justify-center"
      style={{ background: gradient(ribbon.gradientFrom, ribbon.gradientTo, 91) }}
    >
      <ul className="flex flex-wrap items-center justify-center gap-3 tab:gap-5 deskxl:gap-8">
        {badges.map((item, index) => (
          <li key={index} className="flex items-center gap-3 tab:gap-5 deskxl:gap-8">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="hidden tab:block size-6 deskxl:size-[40px] rounded-full bg-white"
              />
            ) : null}
            <span className="flex items-center justify-center min-h-[40px] tab:h-[50px] deskxl:h-[68px] px-5 tab:px-8 deskxl:px-[54px] rounded-full bg-white text-[#0a0b10] font-actay uppercase text-[12px] tab:text-[16px] laptop:text-[20px] deskxl:text-[24px] text-center">
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
