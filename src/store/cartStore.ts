import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cartItem";
import { v4 as uuidv4 } from "uuid";
import { getActualPrice } from "@/utils/bundlePricing";

export interface CmsCartProduct {
  id: string;
  price: number;
  priceDiscount: number;
  outOfStock: boolean;
  // Localized texts, used to show the cart in the current language
  generalname?: string;
  name?: string;
  generalnameUk?: string;
  nameUk?: string;
  preordertext?: string;
  coloropts?: { code: string; color?: string; colorUk?: string }[];
}

// A bundle as returned by GET_BUNDLES_BY_IDS
export interface CmsCartBundle {
  id: string;
  name?: string;
  nameUk?: string;
  bundlePrice: number;
  outOfStock: boolean;
  components: {
    itemId: string | null;
    code: string;
    generalname?: string;
    name?: string;
    generalnameUk?: string;
    nameUk?: string;
    price: number;
    priceDiscount?: number | null;
    colorOpt?: { color?: string; colorUk?: string } | null;
  }[];
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
    options?: { discount?: number },
  ) => CartSyncResult;
  /** Same as syncWithCmsProducts, for the bundle lines of the cart */
  syncBundlesWithCms: (
    bundles: CmsCartBundle[],
    options?: { discount?: number },
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
            (cartItem) => cartItem.uniqueId !== uniqueId,
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
          0,
        );
      },

      syncWithCmsProducts: (products, options) => {
        const state = get();
        const productMap = new Map(
          products.map((product) => [product.id, product]),
        );
        const discount =
          options?.discount ?? (state.promocode ? state.discount : 0);

        let removedCount = 0;
        let outOfStockCount = 0;

        const updatedItems = state.cartItems
          .filter((item) => {
            // bundles are not products: they are synced by syncBundlesWithCms
            if (item.bundle) return true;

            if (!productMap.has(item.id)) {
              removedCount++;
              return false;
            }
            return true;
          })
          .map((item) => {
            if (item.bundle) return item;

            const product = productMap.get(item.id)!;
            const isOutOfStock = product.outOfStock === true;

            if (isOutOfStock) {
              outOfStockCount++;
            }

            const basePrice =
              product.priceDiscount && product.priceDiscount < product.price
                ? product.priceDiscount
                : product.price;

            const colorOpt = product.coloropts?.find(
              (opt) => opt.code === item.code,
            );
            const colorName = colorOpt?.color;

            return {
              ...item,
              generalName: product.generalname ?? item.generalName,
              name: product.name ?? item.name,
              preordertext: product.preordertext ?? item.preordertext,
              color: colorName ?? item.color,
              generalNameUk: product.generalnameUk ?? item.generalNameUk,
              nameUk: product.nameUk ?? item.nameUk,
              colorUk: colorOpt?.colorUk ?? item.colorUk,
              outOfStock: isOutOfStock,
              price: product.price,
              priceDiscount: product.priceDiscount,
              actualPrice: Math.floor(basePrice * (1 - discount / 100)),
            };
          });

        set({ cartItems: updatedItems });

        return { outOfStockCount, removedCount };
      },

      syncBundlesWithCms: (bundles, options) => {
        const state = get();
        const bundleMap = new Map(bundles.map((bundle) => [bundle.id, bundle]));
        const discount =
          options?.discount ?? (state.promocode ? state.discount : 0);

        let removedCount = 0;
        let outOfStockCount = 0;

        const updatedItems = state.cartItems
          .filter((item) => {
            if (!item.bundle) return true;

            if (!bundleMap.has(item.id)) {
              removedCount++;
              return false;
            }
            return true;
          })
          .map((item) => {
            if (!item.bundle) return item;

            const bundle = bundleMap.get(item.id)!;

            if (bundle.outOfStock) {
              outOfStockCount++;
            }

            // The cart mirrors the current content of the set
            const components = bundle.components
              .filter((component) => component.itemId)
              .map((component) => ({
                itemId: component.itemId as string,
                code: component.code,
                generalName: component.generalname ?? "",
                name: component.name ?? "",
                generalNameUk: component.generalnameUk,
                nameUk: component.nameUk,
                color: component.colorOpt?.color ?? "",
                colorUk: component.colorOpt?.colorUk,
                price: getActualPrice(component),
              }));

            const regularPrice = components.reduce(
              (sum, component) => sum + component.price,
              0,
            );

            return {
              ...item,
              name: bundle.name ?? item.name,
              nameUk: bundle.nameUk ?? item.nameUk,
              outOfStock: bundle.outOfStock,
              // never below the bundle price (the price a removed promocode falls back to)
              price: Math.max(regularPrice, bundle.bundlePrice),
              priceDiscount: bundle.bundlePrice,
              actualPrice: Math.floor(bundle.bundlePrice * (1 - discount / 100)),
              bundle: { components },
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
    },
  ),
);
