import { create } from "zustand";
import { OrderData } from "@/types/orderData";
import { persist } from "zustand/middleware";

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
