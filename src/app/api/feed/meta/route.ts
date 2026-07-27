import { NextResponse } from "next/server";
import { client } from "@/lib/sanityClient";
import { GET_FEED_PRODUCTS_QUERY } from "@/lib/queries";

// У Next.js 15 GET Route Handler'и за замовчуванням НЕ кешуються — кожен
// запит бив би напряму в Sanity API (в т.ч. кожен захід бота Meta/Rozetka).
// "force-static" явно вмикає ISR-кешування для цього роуту: відповідь
// генерується один раз і віддається з кешу, а у фоні перегенеровується не
// частіше ніж раз на годину (revalidate нижче).
// Достроково (одразу після зміни товару в адмінці) кеш можна скинути через
// POST /api/revalidate?secret=... — див. src/app/api/revalidate/route.ts.
export const dynamic = "force-static";
export const revalidate = 3600;

const BRAND = "Kondor";
const CURRENCY = "UAH";

interface FeedPhoto {
  alt?: string;
  url: string;
}

interface FeedColorOption {
  code: string;
  color: string;
  photos?: FeedPhoto[];
}

interface FeedProduct {
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

function getBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.kondor.ua/";
  return base.endsWith("/") ? base : `${base}/`;
}

// Мінімальне екранування спецсимволів для текстових вузлів XML.
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Прибирає авторську "markdown-подібну" розмітку опису (список "* ...",
// жирний текст "**...**") і зайві пробіли/переноси, щоб отримати чистий
// текст для поля g:description.
function toPlainDescription(description: string | null): string {
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
function normalizeSpaces(value: string): string {
  return value.replace(/\s{2,}/g, " ").trim();
}

function buildTitle(product: FeedProduct, color: string, hasVariants: boolean): string {
  const base = normalizeSpaces(`${product.generalname} ${product.name}`);
  return hasVariants ? `${base}, колір: ${color}` : base;
}

function buildAvailability(product: FeedProduct): "out of stock" | "preorder" | "in stock" {
  if (product.outOfStock === true) return "out of stock";
  if (product.preorder === true) return "preorder";
  return "in stock";
}

function buildLink(baseUrl: string, slug: string, color: string): string {
  const url = new URL(`catalog/${slug}`, baseUrl);
  if (color) url.searchParams.set("color", color.toLowerCase());
  return url.toString();
}

function buildItemXml(
  product: FeedProduct,
  colorOption: FeedColorOption,
  baseUrl: string,
  hasVariants: boolean
): string | null {
  const photos = colorOption.photos ?? [];
  const [mainPhoto, ...restPhotos] = photos;

  // Без зображення офер не пройде валідацію Meta — пропускаємо такий варіант.
  if (!mainPhoto?.url) return null;

  // Сирий SKU (colorOption.code) не гарантовано унікальний глобально по
  // всьому каталогу (в кількох товарах трапляються однакові коди кольорів),
  // тож формуємо гарантовано унікальний id як "<idТовару>-<code>".
  // trim() — у частині товарів код/колір в Sanity введено з зайвим пробілом.
  const code = colorOption.code?.trim() || "0";
  const color = colorOption.color?.trim() || "";
  const id = `${product.id}-${code}`;
  const title = buildTitle(product, color, hasVariants);
  const description =
    toPlainDescription(product.description) || title;
  const availability = buildAvailability(product);
  const actualPrice =
    product.priceDiscount && product.priceDiscount < product.price
      ? product.priceDiscount
      : null;

  const fields: string[] = [
    `<g:item_group_id>${escapeXml(product.id)}</g:item_group_id>`,
    `<g:id>${escapeXml(id)}</g:id>`,
    `<g:title>${escapeXml(title)}</g:title>`,
    `<g:description>${escapeXml(description)}</g:description>`,
    `<g:link>${escapeXml(buildLink(baseUrl, product.slug, color))}</g:link>`,
    `<g:image_link>${escapeXml(mainPhoto.url)}</g:image_link>`,
    ...restPhotos
      .slice(0, 19)
      .map((photo) => `<additional_image_link>${escapeXml(photo.url)}</additional_image_link>`),
    `<color>${escapeXml(color)}</color>`,
    ...(product.cat?.name
      ? [`<product_type>${escapeXml(product.cat.name)}</product_type>`]
      : []),
    `<g:brand>${escapeXml(BRAND)}</g:brand>`,
    `<g:condition>new</g:condition>`,
    `<g:availability>${availability}</g:availability>`,
    `<g:price>${product.price.toFixed(2)} ${CURRENCY}</g:price>`,
    ...(actualPrice !== null
      ? [`<g:sale_price>${actualPrice.toFixed(2)} ${CURRENCY}</g:sale_price>`]
      : []),
  ];

  return `<item>\n${fields.map((field) => `      ${field}`).join("\n")}\n    </item>`;
}

function buildFeedXml(products: FeedProduct[], baseUrl: string): string {
  const feedUrl = new URL("api/feed/meta", baseUrl).toString();

  const items = products
    .flatMap((product) => {
      const coloropts = product.coloropts ?? [];
      const hasVariants = coloropts.length > 1;
      return coloropts.map((colorOption) =>
        buildItemXml(product, colorOption, baseUrl, hasVariants)
      );
    })
    .filter((item): item is string => Boolean(item));

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kondor Device — товарний фід</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Динамічний фід каталогу товарів Kondor Device для Meta/Facebook Catalog</description>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    ${items.join("\n    ")}
  </channel>
</rss>
`;
}

export async function GET() {
  try {
    const products = await client.fetch<FeedProduct[]>(GET_FEED_PRODUCTS_QUERY);
    const baseUrl = getBaseUrl();
    const xml = buildFeedXml(products, baseUrl);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Failed to generate Meta product feed:", error);
    return NextResponse.json(
      { error: "Failed to generate Meta product feed" },
      { status: 500 }
    );
  }
}
