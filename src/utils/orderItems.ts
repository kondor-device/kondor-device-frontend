import { CartItem } from "@/types/cartItem";
import { allocateBundlePrice } from "@/utils/bundlePricing";

export interface CrmProduct {
  price: number;
  quantity: number;
  name: string;
  sku: string;
}

/**
 * Cart lines -> KeyCRM order products.
 *
 * A bundle (set) is sold as one line on the site, but the CRM has to write off the real
 * products from the stock: every component becomes its own line with its own SKU (the color
 * option code). The price actually paid for the set (after a promocode) is split between the
 * components in proportion to their regular prices, and the parts add up to it exactly, so the
 * order total in the CRM always equals the paid amount.
 *
 * Expects the texts already in Ukrainian (see toUkrainianTexts in handleSubmitForm).
 */
export const expandItemsForCrm = (items: CartItem[]): CrmProduct[] =>
  items.flatMap((item): CrmProduct[] => {
    if (!item.bundle) {
      return [
        {
          price: item.actualPrice,
          quantity: item.quantity,
          name: `${item.generalName} ${item.name}`,
          sku: item.code,
        },
      ];
    }

    const { components } = item.bundle;
    const prices = allocateBundlePrice(
      components.map((component) => component.price),
      item.actualPrice,
    );

    return components.map((component, index) => ({
      price: prices[index],
      quantity: item.quantity,
      name: `[${item.generalName} ${item.name}] ${component.generalName} ${component.name}`,
      sku: component.code,
    }));
  });

/** One order line as text (Telegram, Google Sheets): a set is listed with its content */
export const formatOrderItem = (item: CartItem): string => {
  if (!item.bundle) {
    return `${item.preorder ? "Передзамовлення: " : ""}${item.generalName} ${
      item.name
    }, колір: ${item.color}`;
  }

  const content = item.bundle.components
    .map(
      (component) =>
        `${component.generalName} ${component.name} (${component.color})`,
    )
    .join(" + ");

  return `${item.generalName} ${item.name}: ${content}`;
};

/** Product name for Wayforpay: the set is one position with the set price */
export const formatPaymentItemName = (item: CartItem): string =>
  item.bundle
    ? `${item.generalName} ${item.name}`
    : `${item.generalName} ${item.name} колір: ${item.color}`;
