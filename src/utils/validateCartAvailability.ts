import { GET_PRODUCTS_BY_IDS } from "@/lib/queries";
import { useCartStore } from "@/store/cartStore";
import { getProductsByIds } from "@/utils/getProductsByIds";

export interface CartAvailabilityResult {
  outOfStockCount: number;
  removedCount: number;
}

let validationInFlight: Promise<CartAvailabilityResult> | null = null;

export async function validateCartAvailability(): Promise<CartAvailabilityResult> {
  if (validationInFlight) {
    return validationInFlight;
  }

  validationInFlight = (async () => {
    const cartItems = useCartStore.getState().cartItems;

    if (cartItems.length === 0) {
      return { outOfStockCount: 0, removedCount: 0 };
    }

    const cartItemsIds = cartItems.map((item) => item.id);
    const resProducts = await getProductsByIds(GET_PRODUCTS_BY_IDS, cartItemsIds);
    const productsFromCms = resProducts.data?.allItems ?? [];

    return useCartStore.getState().syncWithCmsProducts(productsFromCms);
  })().finally(() => {
    validationInFlight = null;
  });

  return validationInFlight;
}
