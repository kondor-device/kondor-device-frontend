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

  const categoriesList = allCategories.map((categoryItem) => ({
    title: categoryItem.name,
    category: categoryItem.slug,
  }));

  const toggleType = (type: string) => {
    if (value.includes(type)) {
      onChange(value.filter((t) => t !== type));
    } else {
      onChange([...value, type]);
    }
  };

  const typesList = [...categoriesList, { title: t("new"), category: "new" }];

  console.log(typesList);

  return (
    <FilterLayout title={t("type")}>
      {" "}
      <div className="flex flex-col gap-1">
        {" "}
        {typesList.map((type, idx) => (
          <Checkbox
            key={idx}
            label={type.title}
            checked={value.includes(type.category)}
            onChange={() => toggleType(type.category)}
          />
        ))}
      </div>
    </FilterLayout>
  );
}
