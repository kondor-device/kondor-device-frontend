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
}: {
  product: ProductItem;
  /** Canonical url of the page, without the color */
  url: string;
  title: string;
  categoryName?: string;
}) {
  const coloropts = product.coloropts ?? [];
  const price = getActualPrice(product.price, product.priceDiscount);
  const availability = availabilityUrl(getProductAvailability(product));

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
      }),
    ),
  });
}

/** A set: its own photos first, then the components' photos. Sold at the bundle price. */
export function bundleJsonLd({ bundle, url }: { bundle: Bundle; url: string }) {
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
    },
  });
}
