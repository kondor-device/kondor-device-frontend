import { useTranslations } from "next-intl";
import FilterLayout from "./FilterLayout";
import { CategoryItem } from "@/types/categoryItem";
import Checkbox from "@/components/shared/forms/formComponents/Checkbox";

interface TypeFilterProps {
  allCategories: CategoryItem[];
  value: { title: string; category: string }[];
  onChange: (selected: { title: string; category: string }[]) => void;
}

export default function TypeFilter({
  allCategories,
  value,
  onChange,
}: TypeFilterProps) {
  const t = useTranslations("catalogPage");

  const typesList = [
    ...allCategories.map((categoryItem) => ({
      title: categoryItem.name,
      category: categoryItem.slug,
    })),
    { title: t("new"), category: "new" },
  ];

  const toggleType = (type: { title: string; category: string }) => {
    const isSelected = value.some((v) => v.category === type.category);

    if (isSelected) {
      onChange(value.filter((v) => v.category !== type.category));
    } else {
      onChange([...value, type]);
    }
  };

  return (
    <FilterLayout title={t("type")}>
      <div className="flex flex-col gap-1">
        {typesList.map((type, idx) => (
          <Checkbox
            key={idx}
            label={type.title}
            checked={value.some((v) => v.category === type.category)}
            onChange={() => toggleType(type)}
          />
        ))}
      </div>
    </FilterLayout>
  );
}
