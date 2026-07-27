import { client } from "@/lib/sanityClient";
import { GET_FEED_PRODUCTS_QUERY } from "@/lib/queries";

// Спільна логіка для всіх товарних фідів (Meta/Facebook, Rozetka тощо).
// Винесено в один модуль, щоб:
//  1) не дублювати код формування id/посилань між роутами;
//  2) гарантувати, що ID товару та посилання на картку в РІЗНИХ фідах
//     завжди байтово збігаються (це важливо, зокрема, якщо в майбутньому
//     Facebook Pixel буде передавати content_ids за тим самим id).

export const BRAND = "Kondor";
export const CURRENCY = "UAH";

export interface FeedPhoto {
  alt?: string;
  url: string;
}

export interface FeedColorOption {
  code: string;
  color: string;
  photos?: FeedPhoto[];
}

export interface FeedProduct {
  id: string;
  generalname: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  priceDiscount: number | null;
  preorder: boolean | null;
  preordertext: string | null;
  outOfStock: boolean | null;
  cat: { id: string; name: string; slug: string } | null;
  coloropts: FeedColorOption[] | null;
}

export async function fetchFeedProducts(): Promise<FeedProduct[]> {
  return client.fetch<FeedProduct[]>(GET_FEED_PRODUCTS_QUERY);
}

export function getBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.kondor.ua/";
  return base.endsWith("/") ? base : `${base}/`;
}

// Мінімальне екранування спецсимволів для текстових вузлів XML.
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Прибирає авторську "markdown-подібну" розмітку опису (список "* ...",
// жирний текст "**...**") і зайві пробіли/переноси, щоб отримати чистий
// текст для полів опису фідів.
export function toPlainDescription(description: string | null): string {
  if (!description) return "";

  return description
    .replace(/(?:^|\n)\*\s+/g, "\n")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Прибирає задвоєні пробіли (у деяких товарах є "generalname" з зайвим
// пробілом наприкінці, напр. "Ігрові поверхі ").
export function normalizeSpaces(value: string): string {
  return value.replace(/\s{2,}/g, " ").trim();
}

export function buildTitle(
  product: FeedProduct,
  color: string,
  hasVariants: boolean
): string {
  const base = normalizeSpaces(`${product.generalname} ${product.name}`);
  return hasVariants ? `${base}, колір: ${color}` : base;
}

export function buildAvailability(
  product: FeedProduct
): "out of stock" | "preorder" | "in stock" {
  if (product.outOfStock === true) return "out of stock";
  if (product.preorder === true) return "preorder";
  return "in stock";
}

export function buildLink(baseUrl: string, slug: string, color: string): string {
  const url = new URL(`catalog/${slug}`, baseUrl);
  if (color) url.searchParams.set("color", color.toLowerCase());
  return url.toString();
}

// Сирий SKU (colorOption.code) не гарантовано унікальний глобально по
// всьому каталогу (в кількох товарах трапляються однакові коди кольорів),
// тож формуємо гарантовано унікальний id як "<idТовару>-<code>".
// trim() — у частині товарів код/колір в Sanity введено з зайвим пробілом.
export function buildVariantId(product: FeedProduct, colorOption: FeedColorOption): string {
  const code = colorOption.code?.trim() || "0";
  return `${product.id}-${code}`;
}

export function getVariantColor(colorOption: FeedColorOption): string {
  return colorOption.color?.trim() || "";
}

export function getVariantCode(colorOption: FeedColorOption): string {
  return colorOption.code?.trim() || "";
}
