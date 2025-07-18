import { useTranslations } from "next-intl";
import FilterLayout from "./FilterLayout";
import { useState } from "react";
import { Slider } from "@heroui/react";

export default function PriceFilter() {
  const t = useTranslations("catalogPage");
  const [value, setValue] = useState([599, 4999]);

  return (
    <FilterLayout title={t("price")}>
      <Slider
        className="max-w-md"
        classNames={{
          track: "bg-[#D4D4D8] opacity-50 h-1 rounded-[8px] mt-[47px]",
          filler: "bg-yellow h-1 rounded-[8px]",
          thumb: "bg-yellow range-thumb",
          startContent: "absolute left-0 bottom-[25px] text-[18px] font-medium",
          endContent: "absolute bottom-[25px] right-0 text-[18px] font-medium",
        }}
        showTooltip
        tooltipProps={{
          classNames: {
            base: ["before:bg-yellow "],
            content: ["py-2 shadow-xl", "text-white bg-yellow"],
          },
        }}
        maxValue={4999}
        minValue={599}
        step={100}
        startContent="599 ₴"
        endContent="4999 ₴"
        size="sm"
        value={value}
        onChange={setValue}
      />
    </FilterLayout>
  );
}
