export interface CartItem {
  id: string;
  generalName: string;
  name: string;
  priceDiscount: number;
  price: number;
  quantity: number;
  image: { url: string; alt: string };
  color: string;
}
