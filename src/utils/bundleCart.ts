import { BundleComponent } from "@/types/bundle";
import { CartBundleComponent, CartItem } from "@/types/cartItem";
import { getActualPrice } from "@/utils/bundlePricing";

interface BundleCartSource {
  id: string;
  name: string;
  nameUk?: string;
  bundlePrice: number;
  components: BundleComponent[];
  /** The set's own photos (the first one is the cart image) */
  photos?: { url: string; alt?: string }[];
  /** Localized word "Set" (the cart is shown in the site language) */
  label: string;
}

// The cart line of a bundle (set): one line with its fixed content. In the CRM order it is
// expanded into the components (see expandItemsForCrm).
export const buildBundleCartItem = ({
  id,
  name,
  nameUk,
  bundlePrice,
  components,
  photos,
  label,
}: BundleCartSource): CartItem => {
  const cartComponents: CartBundleComponent[] = components.map((component) => ({
    itemId: component.itemId,
    code: component.code,
    generalName: component.generalname,
    name: component.name,
    generalNameUk: component.generalnameUk,
    nameUk: component.nameUk,
    color: component.colorOpt?.color ?? "",
    colorUk: component.colorOpt?.colorUk,
    price: getActualPrice(component),
  }));

  const regularPrice = cartComponents.reduce(
    (sum, component) => sum + component.price,
    0,
  );

  return {
    id,
    uniqueId: "",
    preorder: false,
    preordertext: "",
    generalName: label,
    generalNameUk: "Сет",
    name,
    nameUk,
    // never below the bundle price: the store falls back to `price` when a promocode is removed
    price: Math.max(regularPrice, bundlePrice),
    priceDiscount: bundlePrice,
    actualPrice: bundlePrice,
    image: photos?.[0]
      ? { url: photos[0].url, alt: photos[0].alt ?? "" }
      : (components[0]?.colorOpt?.photos?.[0] ?? { url: "", alt: "" }),
    color: "",
    code: "",
    quantity: 1,
    bundle: { components: cartComponents },
  };
};
