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
}
