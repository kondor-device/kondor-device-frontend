import { ProductLanding } from "@/types/productItem";
import { gradient, hasText } from "./utils";

type Ribbon = NonNullable<ProductLanding["ribbon"]>;

export default function LandingRibbon({ ribbon }: { ribbon: Ribbon }) {
  const badges = (ribbon.badges ?? []).filter((item) => hasText(item.text));

  return (
    <div
      className="px-5 py-4 tab:py-6"
      style={{ background: gradient(ribbon.gradientFrom, ribbon.gradientTo) }}
    >
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        {badges.map((item, index) => (
          <li key={index} className="flex items-center gap-3">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="hidden tab:block size-2.5 rounded-full bg-white"
              />
            ) : null}
            <span className="px-4 py-1.5 rounded-full bg-white text-dark text-10bold tab:text-12bold uppercase text-center">
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
