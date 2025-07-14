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

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-4 laptop:gap-x-6 laptop:gap-y-[30px]">
      {currentItems.map((item, idx) => (
        <CatalogCard key={idx} product={item} shownOnAddons={shownOnAddons} />
      ))}
    </div>
  );
}
