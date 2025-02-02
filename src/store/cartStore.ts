import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cartItem";
import { v4 as uuidv4 } from "uuid";

interface CartState {
  cartItems: CartItem[];
  addToCart: (newItem: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  removeSingleItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (newItem) => {
        const itemWithUniqueId = { ...newItem, uniqueId: uuidv4() };
        set({ cartItems: [...get().cartItems, itemWithUniqueId] });
      },

      removeFromCart: (itemId) => {
        set({
          cartItems: get().cartItems.filter(
            (cartItem) => cartItem.id !== itemId
          ),
        });
      },

      removeSingleItem: (uniqueId) => {
        set({
          cartItems: get().cartItems.filter(
            (cartItem) => cartItem.uniqueId !== uniqueId
          ),
        });
      },

      clearCart: () => set({ cartItems: [] }),

      getTotalAmount: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => {
          const itemTotal = item.priceDiscount * item.quantity;
          return total + itemTotal;
        }, 0);
      },
    }),
    {
      name: "kondor-cart-storage",
    }
  )
);
