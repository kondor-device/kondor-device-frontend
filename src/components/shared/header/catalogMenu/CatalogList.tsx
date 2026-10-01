import { Dispatch, SetStateAction } from "react";
import CatalogItem from "./CatalogItem";

interface CatalogListProps {
  catalogList: { title: string; category: string; icon: string }[];
  setIsCatalogMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function CatalogList({ catalogList, setIsCatalogMenuOpened }: CatalogListProps) {
  return (
    <ul className="flex flex-col divide-y divide-dark/10">
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
