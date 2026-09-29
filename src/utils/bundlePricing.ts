export interface PricedLine {
  price: number;
  priceDiscount?: number | null;
}

/** Current selling price of a line: the discounted one when it is really lower */
export const getActualPrice = ({ price, priceDiscount }: PricedLine): number =>
  priceDiscount && priceDiscount < price ? priceDiscount : price;

/** Sum of the components' current prices when bought separately */
export const getRegularPrice = (components: PricedLine[]): number =>
  components.reduce((sum, component) => sum + getActualPrice(component), 0);

export interface BundleSavings {
  regularPrice: number;
  savingsUah: number;
  /** Whole percent; 0 when there is no saving */
  savingsPercent: number;
}

/** Saving of a bundle against buying its components separately, in UAH and % */
export const getBundleSavings = (
  regularPrice: number,
  bundlePrice: number,
): BundleSavings => {
  const savingsUah = Math.max(0, regularPrice - bundlePrice);

  if (regularPrice <= 0 || savingsUah === 0) {
    return { regularPrice, savingsUah: 0, savingsPercent: 0 };
  }

  return {
    regularPrice,
    savingsUah,
    // a saving of 0.4% must not be shown as "0%"
    savingsPercent: Math.max(1, Math.round((savingsUah / regularPrice) * 100)),
  };
};

/**
 * Splits the bundle price between its components in proportion to their regular prices
 * so that the parts always add up to the bundle price exactly (largest remainder method).
 * Used to build CRM order lines: the order total must match what the customer paid.
 */
export const allocateBundlePrice = (
  regularPrices: number[],
  bundlePrice: number,
): number[] => {
  if (regularPrices.length === 0) return [];

  const regularSum = regularPrices.reduce((sum, price) => sum + price, 0);
  const shares =
    regularSum > 0
      ? regularPrices.map((price) => (price * bundlePrice) / regularSum)
      : regularPrices.map(() => bundlePrice / regularPrices.length);

  const parts = shares.map(Math.floor);
  let rest = bundlePrice - parts.reduce((sum, part) => sum + part, 0);

  shares
    .map((share, index) => ({ index, fraction: share - Math.floor(share) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index)
    .forEach(({ index }) => {
      if (rest > 0) {
        parts[index] += 1;
        rest -= 1;
      }
    });

  return parts;
};
