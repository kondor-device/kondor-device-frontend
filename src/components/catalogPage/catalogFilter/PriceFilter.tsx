import { useTranslations } from "next-intl";
import FilterLayout from "./FilterLayout";
import { Slider } from "@heroui/react";

interface PriceFilterProps {
  value: [number, number];
  onChange: (val: [number, number]) => void;
}

export default function PriceFilter({ value, onChange }: PriceFilterProps) {
  const t = useTranslations("catalogPage");

  return (
    <FilterLayout title={t("price")}>
      <Slider
        className="max-w-md"
        classNames={{
          track: "bg-[#D4D4D8] opacity-50 h-1 rounded-[8px] mt-[47px]",
          filler: "bg-yellow h-1 rounded-[8px]",
          thumb: "bg-yellow range-thumb",
          startContent:
            "absolute left-0 bottom-[25px] text-[12px] desk:text-[18px] font-medium",
          endContent:
            "absolute bottom-[25px] right-0 text-[12px] desk:text-[18px] font-medium",
        }}
        showTooltip
        tooltipProps={{
          classNames: {
            base: ["before:bg-yellow"],
            content: ["py-2 shadow-xl", "text-white bg-yellow"],
          },
        }}
        maxValue={4999}
        minValue={499}
        step={100}
        startContent="499 ₴"
        endContent="4999 ₴"
        size="sm"
        value={value}
        onChange={(val) => {
          if (Array.isArray(val)) onChange([val[0], val[1]]);
        }}
      />
    </FilterLayout>
  );
}
