import { client } from "@/lib/sanityClient";
import { GET_FEED_PRODUCTS_QUERY } from "@/lib/queries";

// Спільна логіка для всіх товарних фідів (Meta/Facebook, Rozetka тощо).
// Винесено в один модуль, щоб:
//  1) не дублювати код формування id/посилань між роутами;
//  2) гарантувати, що ID товару та посилання на картку в РІЗНИХ фідах
//     завжди байтово збігаються (це важливо, зокрема, якщо в майбутньому
//     Facebook Pixel буде передавати content_ids за тим самим id — див.
//     buildVariantId нижче).

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

export function buildBaseTitle(product: FeedProduct): string {
  return normalizeSpaces(`${product.generalname} ${product.name}`);
}

// Зазвичай кілька кольорів одного товару зберігаються як кілька елементів
// масиву "coloropts" в ОДНОМУ документі Sanity — тоді ознака "hasVariants"
// визначається просто (coloropts.length > 1).
//
// Але трапляються товари, де кожен колір заведено ОКРЕМИМ документом
// (наприклад Kondor Moonlight X: три документи по одному варіанту кожен,
// з однаковою generalname+name). У такому випадку без додаткової перевірки
// назва товару в фіді була б однаковою для кількох різних SKU, що ламає
// вимогу унікальності назв (зокрема в Rozetka YML).
//
// Тому для кожного товару "hasVariants" рахуємо як
// (варіантів у самому документі > 1) ОБО (інших товарів з такою ж базовою
// назвою в каталозі > 1) — і в обох випадках додаємо ", колір: ...".
export function buildBaseTitleCounts(products: FeedProduct[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const product of products) {
    const base = buildBaseTitle(product);
    counts.set(base, (counts.get(base) ?? 0) + 1);
  }
  return counts;
}

export function resolveHasVariants(
  product: FeedProduct,
  baseTitleCounts: Map<string, number>
): boolean {
  const coloropts = product.coloropts ?? [];
  if (coloropts.length > 1) return true;
  const base = buildBaseTitle(product);
  return (baseTitleCounts.get(base) ?? 0) > 1;
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

// id товару в фіді = сирий SKU (colorOption.code), БЕЗ префікса з id товару
// в Sanity. Клієнт підтвердив, що коди кольорів унікальні по всьому
// каталогу (раніше траплялись дублі — станом на зараз прибрані, перевірено
// напряму по даних). trim() — у частині товарів код в Sanity введено з
// зайвим пробілом.
//
// ВАЖЛИВО: якщо в майбутньому в каталог знову потрапить дубльований код
// (наприклад, при копіюванні товару в адмінці без зміни SKU), два різних
// товари в фіді отримають однаковий id — Meta/Rozetka сприймуть другий як
// оновлення першого замість окремого товару. Оскільки унікальність коду
// більше не гарантується на рівні коду фіда, її потрібно підтримувати
// дисципліною в адмінці (унікальний SKU на кожен колірний варіант).
export function buildVariantId(colorOption: FeedColorOption): string {
  return colorOption.code?.trim() || "";
}

export function getVariantColor(colorOption: FeedColorOption): string {
  return colorOption.color?.trim() || "";
}

export function getVariantCode(colorOption: FeedColorOption): string {
  return colorOption.code?.trim() || "";
}
