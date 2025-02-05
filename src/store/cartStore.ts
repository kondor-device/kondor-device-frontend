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
        set((state) => {
          const index = state.cartItems.findIndex((item) => item.id === itemId);
          if (index === -1) return state;

          return {
            cartItems: [
              ...state.cartItems.slice(0, index),
              ...state.cartItems.slice(index + 1),
            ],
          };
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
          const itemTotal = (item.priceDiscount ?? item.price) * item.quantity;
          return total + itemTotal;
        }, 0);
      },
    }),
    {
      name: "kondor-cart-storage",
    }
  )
);
