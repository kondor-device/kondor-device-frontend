import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cartItem";
import { v4 as uuidv4 } from "uuid";

interface CartState {
  cartItems: CartItem[];
  promocode: string | null;
  discount: number;
  addToCart: (newItem: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  removeSingleItem: (itemId: string) => void;
  clearCart: () => void;
  applyPromocode: (code: string, discount: number) => void;
  removePromocode: () => void;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      promocode: null,
      discount: 0,

      addToCart: (newItem) => {
        const state = get();
        const actualPrice = state.promocode
          ? Math.floor(newItem.actualPrice * (1 - state.discount / 100))
          : newItem.actualPrice;

        const itemWithUniqueId = {
          ...newItem,
          uniqueId: uuidv4(),
          actualPrice,
        };

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

      clearCart: () => set({ cartItems: [], promocode: null, discount: 0 }),

      applyPromocode: (code, discount) => {
        set((state) => ({
          promocode: code,
          discount,
          cartItems: state.cartItems.map((item) => ({
            ...item,
            actualPrice: Math.round(item.actualPrice * (1 - discount / 100)),
          })),
        }));
      },

      removePromocode: () => {
        set((state) => ({
          promocode: null,
          discount: 0,
          cartItems: state.cartItems.map((item) => ({
            ...item,
            actualPrice:
              item.priceDiscount && item.priceDiscount < item.price
                ? item.priceDiscount
                : item.price,
          })),
        }));
      },

      getTotalAmount: () => {
        const { cartItems } = get();
        return cartItems.reduce(
          (sum, item) => sum + item.actualPrice * item.quantity,
          0
        );
      },
    }),
    {
      name: "kondor-cart-storage",
    }
  )
);
