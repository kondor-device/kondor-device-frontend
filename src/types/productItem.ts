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

/** Every section, photo and colour of the landing may be null: the admin fields are optional */
export interface LandingImage {
  alt: string;
  url: string;
}

export interface LandingTextBlock {
  title: string | null;
  description: string | null;
  image: LandingImage | null;
  /** Colour of the decorative stars and of the badges (hex) */
  accentColor: string | null;
  badges: { text: string | null }[] | null;
}

/** Sections shown after the main content of the product page (filled in the admin) */
export interface ProductLanding {
  hero: {
    label: string | null;
    model: string | null;
    description: string | null;
    image: LandingImage | null;
    gradientFrom: string | null;
    gradientTo: string | null;
    badges: { badge: string | null; text: string | null }[] | null;
  } | null;
  textBlock1: LandingTextBlock | null;
  textBlock2: LandingTextBlock | null;
  ribbon: {
    gradientFrom: string | null;
    gradientTo: string | null;
    badges: { text: string | null }[] | null;
  } | null;
  steps: {
    image: LandingImage | null;
    items: { title: string | null; description: string | null }[] | null;
  } | null;
  banner: { image: LandingImage | null } | null;
  textBlock3: LandingTextBlock | null;
  textBlock4: LandingTextBlock | null;
  faq: {
    items: { question: string | null; answer: string | null }[] | null;
  } | null;
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
  /** Only returned by the product page query; null when nothing is filled in */
  landing?: ProductLanding | null;
  cat: { name: string; id: string };
  preorder: boolean;
  preordertext: string;
  outOfStock: boolean;
  /** "bundle" for a bundle (set) card in a category: `price` is then the sum of the
   * components' current prices, `priceDiscount` the bundle price, `coloropts`/`chars`/
   * `complect` are empty. Absent for ordinary products. */
  kind?: "bundle";
  /** Photos of the set itself (only when `kind === "bundle"`), before the components' photos */
  bundlePhotos?: Photo[];
  /** Fixed content of a bundle (only when `kind === "bundle"`) */
  bundleComponents?: BundleComponent[];
  /** Slug of the parent category. Not returned by every query — attached
   * client-side where the category is known, to build /catalog/[category]/[product] links. */
  categorySlug?: string;
}
