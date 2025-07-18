import { CategoryItem } from "@/types/categoryItem";
import CatalogFilter from "./catalogFilter/CatalogFilter";
import CatalogSlider from "./CatalogSlider";
import { ProductItem } from "@/types/productItem";

interface CatalogProps {
  currentCategories: CategoryItem[];
  allCategories: CategoryItem[];
  shownOnAddons: ProductItem[];
  categoryArray: string[];
}

export default function Catalog({
  currentCategories,
  allCategories,
  shownOnAddons,
  categoryArray,
}: CatalogProps) {
  return (
    <section className="flex gap-4 laptop:gap-[30px] container max-w-[1920px] mt-6 pb-8 laptop:pb-[100px]">
      <CatalogFilter allCategories={allCategories} />
      <CatalogSlider
        currentCategories={currentCategories}
        shownOnAddons={shownOnAddons}
        categoryArray={categoryArray}
      />
    </section>
  );
}
