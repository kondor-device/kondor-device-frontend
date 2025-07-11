import { ProductItem } from "./productItem";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: { alt: string; url: string };
  items: ProductItem[];
}
