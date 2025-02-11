import { ProductItem } from "./productItem";

export interface CategoryItem {
  name: string;
  pos: number;
  id: string;
  items: ProductItem[];
}
