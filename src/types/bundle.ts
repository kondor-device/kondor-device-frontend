import { ColorOpt } from "./productItem";

/** A fixed (product + color) line of a bundle. The color cannot be chosen by the buyer. */
export interface BundleComponent {
  itemId: string;
  slug: string;
  /** Slug of the component's own category, for the link to its product page */
  categorySlug?: string;
  generalname: string;
  name: string;
  generalnameUk?: string;
  nameUk?: string;
  price: number;
  priceDiscount?: number;
  outOfStock: boolean;
  /** Color option code — the SKU in the CRM, its stock is what gets written off */
  code: string;
  colorOpt: ColorOpt;
}

/** Full bundle for its own page (only bundles with every component in stock are returned) */
export interface Bundle {
  id: string;
  slug: string;
  name: string;
  nameUk?: string;
  description?: string;
  bundlePrice: number;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: { url: string };
  components: BundleComponent[];
}
