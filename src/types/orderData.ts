import { CartItem } from "./cartItem";

export interface OrderData {
  orderDate: string;
  orderNumber: string;
  name: string;
  surname: string;
  phone: string;
  city: string;
  postOffice: string;
  promocode: string | null;
  discount: number;
  payment: string;
  updatedCartItems: CartItem[];
  totalSum: number;
}
