/** A fixed (product + color) line of a bundle in the cart. Kept lean: the cart is persisted. */
export interface CartBundleComponent {
  itemId: string;
  /** Color option code: the SKU in the CRM */
  code: string;
  generalName: string;
  name: string;
  generalNameUk?: string;
  nameUk?: string;
  color: string;
  colorUk?: string;
  /** Current selling price of the component when bought separately — the weight used
   * to split the bundle price between the components in the CRM order */
  price: number;
}

export interface CartItem {
  id: string;
  uniqueId: string;
  generalName: string;
  name: string;
  // Ukrainian texts for analytics, CRM etc. (the site texts above are in the current language)
  generalNameUk?: string;
  nameUk?: string;
  colorUk?: string;
  priceDiscount: number;
  price: number;
  actualPrice: number;
  quantity: number;
  image: { url: string; alt: string };
  color: string;
  code: string;
  preorder: boolean;
  preordertext: string;
  outOfStock?: boolean;
  /** Set only for a bundle (set): `id` is then the bundle id, `price` the sum of the components,
   * `priceDiscount` the bundle price. In the CRM order it is expanded into its components. */
  bundle?: { components: CartBundleComponent[] };
}
