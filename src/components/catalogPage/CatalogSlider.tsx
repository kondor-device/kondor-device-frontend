import { CategoryItem } from "@/types/categoryItem";
import CatalogCard from "./CatalogCard";
import { ProductItem } from "@/types/productItem";

interface CatalogSliderProps {
  currentCategories: CategoryItem[];
  shownOnAddons: ProductItem[];
}

export default function CatalogSlider({
  currentCategories,
  shownOnAddons,
}: CatalogSliderProps) {
  const currentItems = currentCategories.flatMap((category) => category.items);

  console.log(currentItems);

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-[30px]">
      {currentItems.map((item, idx) => (
        <CatalogCard key={idx} product={item} shownOnAddons={shownOnAddons} />
      ))}
    </div>
  );
}
