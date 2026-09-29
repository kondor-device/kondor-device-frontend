import { GET_BUNDLES_BY_IDS, GET_PRODUCTS_BY_IDS } from "@/lib/queries";
import { getBundlesByIds } from "@/utils/getBundlesByIds";
import { useCartStore } from "@/store/cartStore";
import { getProductsByIds } from "@/utils/getProductsByIds";

export interface CartAvailabilityResult {
  outOfStockCount: number;
  removedCount: number;
}

let validationInFlight: Promise<CartAvailabilityResult> | null = null;

export async function validateCartAvailability(
  locale?: string
): Promise<CartAvailabilityResult> {
  if (validationInFlight) {
    return validationInFlight;
  }

  validationInFlight = (async () => {
    const cartItems = useCartStore.getState().cartItems;

    if (cartItems.length === 0) {
      return { outOfStockCount: 0, removedCount: 0 };
    }

    const productIds = cartItems
      .filter((item) => !item.bundle)
      .map((item) => item.id);
    const bundleIds = cartItems
      .filter((item) => item.bundle)
      .map((item) => item.id);

    const [resProducts, resBundles] = await Promise.all([
      getProductsByIds(GET_PRODUCTS_BY_IDS, productIds, locale),
      bundleIds.length > 0
        ? getBundlesByIds(GET_BUNDLES_BY_IDS, bundleIds, locale)
        : null,
    ]);
    const productsFromCms = resProducts.data?.allItems ?? [];
    const bundlesFromCms = resBundles?.data?.allBundles ?? [];

    const products = useCartStore
      .getState()
      .syncWithCmsProducts(productsFromCms);
    const bundles = useCartStore
      .getState()
      .syncBundlesWithCms(bundlesFromCms);

    return {
      outOfStockCount: products.outOfStockCount + bundles.outOfStockCount,
      removedCount: products.removedCount + bundles.removedCount,
    };
  })().finally(() => {
    validationInFlight = null;
  });

  return validationInFlight;
}
