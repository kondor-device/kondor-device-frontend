export interface CartItem {
  id: string;
  uniqueId: string;
  generalName: string;
  name: string;
  priceDiscount: number;
  price: number;
  actualPrice: number;
  quantity: number;
  image: { url: string; alt: string };
  color: string;
  preorder: boolean
}
