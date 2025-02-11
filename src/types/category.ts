import { ProductItem } from "./productItem";

export interface Category {
  id: string;
  name: string;
  items: ProductItem[];
}
