import { ProductItem } from "./productItem";

export interface CategoryItem {
  name: string;
  pos: number;
  id: string;
  slug: string;
  image: { alt: string; url: string };
  items: ProductItem[];
}
