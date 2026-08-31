import { CartItem } from "./cartItem";

export interface OrderData {
  orderDate: string;
  /** UTC ISO для KeyCRM (orderedAt). Якщо немає — використовується orderDate. */
  orderedAtIso?: string;
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
