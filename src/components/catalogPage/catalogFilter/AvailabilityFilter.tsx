import { useTranslations } from "next-intl";
import FilterLayout from "./FilterLayout";
import Checkbox from "@/components/shared/forms/formComponents/Checkbox";

interface AvailabilityFilterProps {
  value: { title: string; value: string }[];
  onChange: (selected: { title: string; value: string }[]) => void;
}

export default function AvailabilityFilter({
  value,
  onChange,
}: AvailabilityFilterProps) {
  const t = useTranslations("catalogPage");

  const availabilityList = [
    { title: t("inStock"), value: "in-stock" },
    { title: t("preOrder"), value: "pre-order" },
  ];

  const toggleAvailability = (item: { title: string; value: string }) => {
    const isSelected = value.some((v) => v.value === item.value);

    if (isSelected) {
      onChange(value.filter((v) => v.value !== item.value));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <FilterLayout title={t("availability")}>
      <div className="flex flex-col gap-1">
        {availabilityList.map((item, idx) => (
          <Checkbox
            key={idx}
            label={item.title}
            checked={value.some((v) => v.value === item.value)}
            onChange={() => toggleAvailability(item)}
          />
        ))}
      </div>
    </FilterLayout>
  );
}
