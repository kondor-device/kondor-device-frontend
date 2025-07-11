import { Dispatch, SetStateAction } from "react";
import CatalogItem from "./CatalogItem";

interface CatalogListProps {
  catalogList: { title: string; category: string; icon: string }[];
  setIsCatalogMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function CatalogList({ catalogList, setIsCatalogMenuOpened }: CatalogListProps) {
  return (
    <ul className="flex flex-wrap gap-4">
      {catalogList.map((catalogItem, idx) => (
        <CatalogItem
          catalogItem={catalogItem}
          key={idx}
          setIsCatalogMenuOpened={setIsCatalogMenuOpened}
        />
      ))}
    </ul>
  );
}
