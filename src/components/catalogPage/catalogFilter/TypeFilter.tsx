"use client";

import { useTranslations } from "next-intl";
import FilterLayout from "./FilterLayout";
import { CategoryItem } from "@/types/categoryItem";
import Checkbox from "@/components/shared/forms/formComponents/Checkbox";

interface TypeFilterProps {
  allCategories: CategoryItem[];
  value: { title: string; category: string }[];
  newValue: boolean;
  onChange: (selected: { title: string; category: string }[]) => void;
  onChangeNew: (selected: boolean) => void;
}

export default function TypeFilter({
  allCategories,
  value,
  newValue,
  onChange,
  onChangeNew,
}: TypeFilterProps) {
  const t = useTranslations("catalogPage");

  const categoryTypes = allCategories.map((categoryItem) => ({
    title: categoryItem.name,
    category: categoryItem.slug,
  }));

  const toggleCategory = (type: { title: string; category: string }) => {
    const isSelected = value.some((v) => v.category === type.category);
    if (isSelected) {
      onChange(value.filter((v) => v.category !== type.category));
    } else {
      onChange([...value, type]);
    }
  };

  const toggleNew = () => {
    onChangeNew(!newValue);
  };

  return (
    <FilterLayout title={t("type")}>
      <div className="flex flex-col gap-1">
        {categoryTypes.map((type, idx) => (
          <Checkbox
            key={idx}
            label={type.title}
            checked={value.some((v) => v.category === type.category)}
            onChange={() => toggleCategory(type)}
          />
        ))}
        <Checkbox
          key="new"
          label={t("new")}
          checked={newValue}
          onChange={toggleNew}
        />
      </div>
    </FilterLayout>
  );
}
