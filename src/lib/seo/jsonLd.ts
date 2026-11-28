import type { Bundle } from "@/types/bundle";
import type { Locale } from "@/types/locale";
import type { ProductItem } from "@/types/productItem";
import {
  EMAIL_FIRST,
  INSTAGRAM_URL,
  TELEGRAM_URL,
} from "@/constants/constants";
import { toPlainDescription } from "@/lib/feed";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import { absoluteUrl } from "@/lib/seo/pageSeo";
import { getLocalizedPath } from "@/utils/getLocalizedPath";
import { formatRating } from "@/utils/formatRating";

// schema.org structured data (JSON-LD) built from the same data the page shows.
// Render it with components/shared/JsonLd.

const CONTEXT = "https://schema.org";
const CURRENCY = "UAH";
const BRAND = { "@type": "Brand", name: "Kondor" };

const IN_LANGUAGE: Record<Locale, string> = { uk: "uk-UA", ru: "ru-UA" };

type Availability = "InStock" | "OutOfStock" | "PreOrder";

const availabilityUrl = (availability: Availability) =>
  `https://schema.org/${availability}`;

const withoutEmpty = <T extends Record<string, unknown>>(data: T): T =>
  Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0),
    ),
  ) as T;

// Discounted price when there is one (the same rule as in the product feeds)
const getActualPrice = (price: number, priceDiscount?: number | null) =>
  priceDiscount && priceDiscount > 0 && priceDiscount < price
    ? priceDiscount
    : price;

const getProductAvailability = (product: ProductItem): Availability => {
  if (product.outOfStock) return "OutOfStock";
  if (product.preorder) return "PreOrder";
  return "InStock";
};

const unique = (values: (string | undefined | null)[]) => [
  ...new Set(values.filter((value): value is string => Boolean(value))),
];

// Delivery and returns for Google merchant listings, from the shop's own pages.
// /delivery (messages/*.json, delivery.two): Nova Poshta across Ukraine, the buyer pays
// Nova Poshta's tariff, from 90 UAH (a typical parcel up to 2 kg, owner 28.11.2026).
// Parcels go out every day: same or next day, plus a day on the road, 1–2 days in total.
// Change the page text and these values together.
const SHIPPING_DETAILS = {
  "@type": "OfferShippingDetails",
  shippingRate: { "@type": "MonetaryAmount", value: 90, currency: CURRENCY },
  shippingDestination: { "@type": "DefinedRegion", addressCountry: "UA" },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
    transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 1, unitCode: "DAY" },
  },
};

// /returns: 14 days from receipt, full refund, sent back by Nova Poshta. The buyer pays the
// return of an item that just did not suit; the shop pays when the item is faulty.
const returnPolicy = (locale: Locale) => ({
  "@type": "MerchantReturnPolicy",
  applicableCountry: "UA",
  returnPolicyCountry: "UA",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 14,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
  itemDefectReturnFees: "https://schema.org/FreeReturn",
  refundType: "https://schema.org/FullRefund",
  // The returns page in the language of the product page
  merchantReturnLink: absoluteUrl(getLocalizedPath(locale, "/returns")),
});

export function organizationJsonLd() {
  return {
    "@context": CONTEXT,
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/icons/logo.svg`,
    email: EMAIL_FIRST,
    sameAs: [INSTAGRAM_URL, TELEGRAM_URL],
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: IN_LANGUAGE[locale],
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  if (items.length === 0) return null;

  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/**
 * Product with one offer per color option: every option is its own SKU (the same code the
 * product feeds use as id) and has its own link.
 */
export function productJsonLd({
  product,
  url,
  title,
  categoryName,
  locale,
}: {
  product: ProductItem;
  /** Canonical url of the page, without the color */
  url: string;
  title: string;
  categoryName?: string;
  locale: Locale;
}) {
  const coloropts = product.coloropts ?? [];
  const price = getActualPrice(product.price, product.priceDiscount);
  const productAvailability = getProductAvailability(product);
  const availability = availabilityUrl(productAvailability);

  return withoutEmpty({
    "@context": CONTEXT,
    "@type": "Product",
    name: title,
    description: toPlainDescription(product.description ?? null) || undefined,
    url,
    image: unique(
      coloropts.flatMap((option) => option.photos?.map((photo) => photo.url)),
    ),
    sku: coloropts[0]?.code?.trim() || undefined,
    brand: BRAND,
    category: categoryName,
    aggregateRating: product.ratingCount ? {
      "@type": "AggregateRating",
      ratingValue: formatRating(product.ratingAvg),
      reviewCount: product.ratingCount,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    review: product.ratingCount ? (product.reviews ?? []).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      datePublished: review.date,
      reviewBody: review.text,
      reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5, worstRating: 1 },
    })) : undefined,
    additionalProperty: (product.chars ?? [])
      .filter((item) => item.name && item.char)
      .map((item) => ({
        "@type": "PropertyValue",
        name: item.name,
        value: item.char,
      })),
    offers: coloropts.map((option) =>
      withoutEmpty({
        "@type": "Offer",
        sku: option.code?.trim(),
        url: option.code
          ? `${url}?color=${encodeURIComponent(option.code.trim())}`
          : url,
        priceCurrency: CURRENCY,
        price,
        itemCondition: "https://schema.org/NewCondition",
        availability,
        // A preorder ships later than the usual 1–2 days: no delivery time for it
        shippingDetails: productAvailability === "PreOrder" ? undefined : SHIPPING_DETAILS,
        hasMerchantReturnPolicy: returnPolicy(locale),
      }),
    ),
  });
}

/** A set: its own photos first, then the components' photos. Sold at the bundle price. */
export function bundleJsonLd({
  bundle,
  url,
  locale,
}: {
  bundle: Bundle;
  url: string;
  locale: Locale;
}) {
  return withoutEmpty({
    "@context": CONTEXT,
    "@type": "Product",
    name: bundle.name,
    description: toPlainDescription(bundle.description ?? null) || undefined,
    url,
    image: unique([
      ...(bundle.photos ?? []).map((photo) => photo.url),
      ...bundle.components.map(
        (component) => component.colorOpt?.photos?.[0]?.url,
      ),
    ]),
    brand: BRAND,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: CURRENCY,
      price: bundle.bundlePrice,
      itemCondition: "https://schema.org/NewCondition",
      availability: availabilityUrl(
        bundle.outOfStock ? "OutOfStock" : "InStock",
      ),
      shippingDetails: SHIPPING_DETAILS,
      hasMerchantReturnPolicy: returnPolicy(locale),
    },
  });
}
