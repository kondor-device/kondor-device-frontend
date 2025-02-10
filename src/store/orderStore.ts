import { create } from "zustand";
import { CartItem } from "@/types/cartItem";
import { persist } from "zustand/middleware";

interface OrderData {
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

interface OrderState {
  orderData: OrderData | null;
  setOrderData: (data: OrderData) => void;
  clearOrderData: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orderData: null,
      setOrderData: (data) => set({ orderData: data }),
      clearOrderData: () => set({ orderData: null }),
    }),
    {
      name: "kondor-order-storage",
    }
  )
);
