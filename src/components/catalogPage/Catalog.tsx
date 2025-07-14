import { CategoryItem } from "@/types/categoryItem";
import CatalogFilter from "./CatalogFilter";
import CatalogSlider from "./CatalogSlider";
import { ProductItem } from "@/types/productItem";

interface CatalogProps {
  currentCategories: CategoryItem[];
  shownOnAddons: ProductItem[];
}

export default function Catalog({
  currentCategories,
  shownOnAddons,
}: CatalogProps) {
  console.log(currentCategories);
  return (
    <section className="flex gap-[30px] container max-w-[1920px] mt-6">
      <CatalogFilter />
      <CatalogSlider
        currentCategories={currentCategories}
        shownOnAddons={shownOnAddons}
      />
    </section>
  );
}
