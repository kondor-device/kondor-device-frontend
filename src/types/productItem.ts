import { BundleComponent } from "./bundle";

interface Photo {
  alt: string;
  url: string;
}

export interface ColorOpt {
  code: string;
  color: string;
  colorUk?: string;
  colorset: { hex: string };
  photos: Photo[];
}

export interface Characteristic {
  name: string;
  char: string;
}

export interface ComplectItem {
  name: string;
  icon: { url: string; alt: string };
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  /** ISO datetime */
  date: string;
}

export interface ProductItem {
  id: string;
  generalname: string;
  generalnameUk?: string;
  name: string;
  nameUk?: string;
  slug: string;
  price: number;
  priceDiscount: number;
  description: string;
  newItem: boolean;
  driver?: string;
  manual?: string;
  video?: { url: string };
  showonaddons: boolean;
  showonmain: boolean;
  badge?: {
    text: string;
    backgroundColor?: {
      hex: string;
    };
  };
  complect: ComplectItem[];
  coloropts: ColorOpt[];
  chars: Characteristic[];
  cat: { name: string; id: string };
  preorder: boolean;
  preordertext: string;
  outOfStock: boolean;
  /** Кількість схвалених відгуків (0, якщо їх немає) */
  ratingCount?: number;
  /** Середня оцінка схвалених відгуків; null/відсутня, якщо відгуків немає */
  ratingAvg?: number | null;
  /** Схвалені відгуки — лише в детальному запиті товару */
  reviews?: Review[];
  /** "bundle" for a bundle (set) card in a category: `price` is then the sum of the
   * components' current prices, `priceDiscount` the bundle price, `coloropts`/`chars`/
   * `complect` are empty. Absent for ordinary products. */
  kind?: "bundle";
  /** Fixed content of a bundle (only when `kind === "bundle"`) */
  bundleComponents?: BundleComponent[];
  /** Slug of the parent category. Not returned by every query — attached
   * client-side where the category is known, to build /catalog/[category]/[product] links. */
  categorySlug?: string;
}
