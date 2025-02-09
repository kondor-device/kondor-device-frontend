import { create } from "zustand";
import { CartItem } from "@/types/cartItem";

interface OrderData {
  orderDate: string;
  orderNumber: string;
  name: string;
  surname: string;
  phone: string;
  city: string;
  postOffice: string;
  promocode: string;
  payment: string;
  updatedCartItems: CartItem[];
  totalSum: number;
}

interface OrderState {
  orderData: OrderData | null;
  setOrderData: (data: OrderData) => void;
  clearOrderData: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orderData: null,
  setOrderData: (data) => set({ orderData: data }),
  clearOrderData: () => set({ orderData: null }),
}));
