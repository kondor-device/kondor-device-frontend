import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cartItem";
import { v4 as uuidv4 } from "uuid";

export interface CmsCartProduct {
  id: string;
  price: number;
  priceDiscount: number;
  outOfStock: boolean;
}

export interface CartSyncResult {
  outOfStockCount: number;
  removedCount: number;
}

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
  syncWithCmsProducts: (
    products: CmsCartProduct[],
    options?: { discount?: number }
  ) => CartSyncResult;
  hasOutOfStockItems: () => boolean;
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

      syncWithCmsProducts: (products, options) => {
        const state = get();
        const productMap = new Map(products.map((product) => [product.id, product]));
        const discount =
          options?.discount ?? (state.promocode ? state.discount : 0);

        let removedCount = 0;
        let outOfStockCount = 0;

        const updatedItems = state.cartItems
          .filter((item) => {
            if (!productMap.has(item.id)) {
              removedCount++;
              return false;
            }
            return true;
          })
          .map((item) => {
            const product = productMap.get(item.id)!;
            const isOutOfStock = product.outOfStock === true;

            if (isOutOfStock) {
              outOfStockCount++;
            }

            const basePrice =
              product.priceDiscount && product.priceDiscount < product.price
                ? product.priceDiscount
                : product.price;

            return {
              ...item,
              outOfStock: isOutOfStock,
              price: product.price,
              priceDiscount: product.priceDiscount,
              actualPrice: Math.floor(basePrice * (1 - discount / 100)),
            };
          });

        set({ cartItems: updatedItems });

        return { outOfStockCount, removedCount };
      },

      hasOutOfStockItems: () =>
        get().cartItems.some((item) => item.outOfStock === true),
    }),
    {
      name: "kondor-cart-storage",
    }
  )
);
