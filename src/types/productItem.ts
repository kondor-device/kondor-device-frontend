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

/** Block of the landing builder; `_type` tells which one it is */
interface LandingBlockBase {
  _key: string;
}

export interface LandingTextPhotoBlock extends LandingTextBlock, LandingBlockBase {
  _type: "landingTextPhoto";
  /** Photo in a rounded frame, wider than the usual one */
  framed: boolean;
  /** Badges under the photo instead of under the text */
  badgesUnderImage: boolean;
}

export interface LandingDarkCardBlock extends LandingTextBlock, LandingBlockBase {
  _type: "landingDarkCard";
}

export interface LandingSquarePhotoBlock extends LandingTextBlock, LandingBlockBase {
  _type: "landingSquarePhoto";
}

export interface LandingRibbonBlock extends LandingBlockBase {
  _type: "landingRibbon";
  gradientFrom: string | null;
  gradientTo: string | null;
  badges: { text: string | null }[] | null;
}

export interface LandingStepsBlock extends LandingBlockBase {
  _type: "landingSteps";
  image: LandingImage | null;
  items: { title: string | null; description: string | null }[] | null;
}

export interface LandingBannerBlock extends LandingBlockBase {
  _type: "landingBanner";
  image: LandingImage | null;
}

export interface LandingFaqBlock extends LandingBlockBase {
  _type: "landingFaq";
  items: { question: string | null; answer: string | null }[] | null;
}

export type LandingSection =
  | LandingTextPhotoBlock
  | LandingDarkCardBlock
  | LandingSquarePhotoBlock
  | LandingRibbonBlock
  | LandingStepsBlock
  | LandingBannerBlock
  | LandingFaqBlock;

/** Header and blocks shown after the main content of the product page (filled in the admin) */
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
  sections: LandingSection[] | null;
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
