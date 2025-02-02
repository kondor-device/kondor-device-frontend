import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  generalName: string;
  name: string;
  priceDiscount: number;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (newItem: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (newItem) => {
        const { cartItems } = get();
        const existingCartItem = cartItems.find(
          (cartItem) => cartItem.id === newItem.id
        );

        if (existingCartItem) {
          set({
            cartItems: cartItems.map((cartItem) =>
              cartItem.id === newItem.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          });
        } else {
          set({ cartItems: [...cartItems, { ...newItem, quantity: 1 }] });
        }
      },
      removeFromCart: (itemId) => {
        set({
          cartItems: get().cartItems.filter(
            (cartItem) => cartItem.id !== itemId
          ),
        });
      },
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "kondor-cart-storage",
    }
  )
);
