import { NextResponse } from "next/server";
import {
  BRAND,
  CURRENCY,
  FeedColorOption,
  FeedProduct,
  buildBaseTitleCounts,
  buildLink,
  buildTitle,
  buildVariantId,
  escapeXml,
  fetchFeedProducts,
  getBaseUrl,
  getVariantCode,
  getVariantColor,
  resolveHasVariants,
  toPlainDescription,
} from "@/lib/feed";

// Той самий підхід до кешування, що й у /api/feed/meta — див. коментар там.
// Достроково фід можна скинути через POST /api/revalidate?secret=...
export const dynamic = "force-static";
export const revalidate = 3600;

// В окремих товарах (~30% каталогу на момент написання) поле "cat" в Sanity
// не заповнене — тег categoryId в YML ОБОВ'ЯЗКОВИЙ, тому такі товари
// відносимо до службової категорії "Інше", щоб вони не випадали з фіда
// Rozetka. Рекомендація: заповнити category для цих товарів в адмінці.
const FALLBACK_CATEGORY_ID = "uncategorized";
const FALLBACK_CATEGORY_NAME = "Інше";

// Rozetka: id товарної пропозиції — тільки Aa-Zz, 0-9, дефіс; без кирилиці
// та пробілів (вимога з офіційної документації Rozetka). Наш id (сирий SKU
// кольору з Sanity) в теорії вже відповідає цій вимозі, санітизація —
// про всяк випадок, щоб побитий/нетиповий код (наприклад, із зайвим
// пробілом чи символом) не зламав валідацію фіда.
function sanitizeId(value: string): string {
  return value
    .replace(/[^A-Za-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Rozetka дозволяє форматувати опис HTML-тегами всередині CDATA. Ми не
// зберігаємо HTML в Sanity (тільки "markdown-подібний" текст), тож віддаємо
// очищений plain text, обгорнутий в CDATA (про всяк випадок екрануємо
// послідовність "]]>", яка закриває CDATA-блок завчасно).
function toCdata(value: string): string {
  const safe = value.replace(/]]>/g, "] ]>");
  return `<![CDATA[${safe}]]>`;
}

interface RozetkaCategory {
  id: string;
  name: string;
}

function resolveCategory(product: FeedProduct): RozetkaCategory {
  if (product.cat?.id && product.cat?.name) {
    return { id: sanitizeId(product.cat.id), name: product.cat.name };
  }
  return { id: FALLBACK_CATEGORY_ID, name: FALLBACK_CATEGORY_NAME };
}

function buildOfferXml(
  product: FeedProduct,
  colorOption: FeedColorOption,
  baseUrl: string,
  hasVariants: boolean,
  category: RozetkaCategory
): string | null {
  const photos = colorOption.photos ?? [];

  // Без зображення офер не пройде валідацію Rozetka (picture — обов'язковий) —
  // пропускаємо такий варіант, як і у фіді Meta.
  if (photos.length === 0) return null;

  const color = getVariantColor(colorOption);
  const code = getVariantCode(colorOption);
  const id = sanitizeId(buildVariantId(colorOption));
  const title = escapeXml(buildTitle(product, color, hasVariants));
  const description = toCdata(toPlainDescription(product.description) || title);

  const outOfStock = product.outOfStock === true;
  // У Rozetka немає окремого стану "передзамовлення" — товар або в наявності
  // (available="true"), або ні. Передзамовлення трактуємо як доступний до
  // купівлі. Реальної кількості на складі Sanity не зберігає, тож
  // stock_quantity — умовне число: 0 для "немає в наявності", інакше
  // фіксоване значення, що не позначає товар як розпроданий.
  const available = !outOfStock;
  const stockQuantity = outOfStock ? 0 : 999;

  const actualPrice =
    product.priceDiscount && product.priceDiscount < product.price
      ? product.priceDiscount
      : null;
  const price = actualPrice ?? product.price;
  const priceOld = actualPrice !== null ? product.price : null;

  const fields: string[] = [
    `<url>${escapeXml(buildLink(baseUrl, product.slug, color))}</url>`,
    `<price>${price.toFixed(2)}</price>`,
    ...(priceOld !== null ? [`<price_old>${priceOld.toFixed(2)}</price_old>`] : []),
    `<currencyId>${CURRENCY}</currencyId>`,
    `<categoryId>${escapeXml(category.id)}</categoryId>`,
    ...photos
      .slice(0, 15)
      .map((photo) => `<picture>${escapeXml(photo.url)}</picture>`),
    `<vendor>${escapeXml(BRAND)}</vendor>`,
    ...(code ? [`<article>${escapeXml(code)}</article>`] : []),
    `<stock_quantity>${stockQuantity}</stock_quantity>`,
    `<name>${title}</name>`,
    `<name_ua>${title}</name_ua>`,
    `<description>${description}</description>`,
    `<description_ua>${description}</description_ua>`,
    `<state>new</state>`,
    ...(color ? [`<param name="Колір">${escapeXml(color)}</param>`] : []),
  ];

  return `<offer id="${escapeXml(id)}" available="${available}">\n${fields
    .map((field) => `        ${field}`)
    .join("\n")}\n      </offer>`;
}

function buildFeedXml(products: FeedProduct[], baseUrl: string): string {
  const categoriesById = new Map<string, string>();
  const offers: string[] = [];
  const baseTitleCounts = buildBaseTitleCounts(products);

  for (const product of products) {
    const category = resolveCategory(product);
    categoriesById.set(category.id, category.name);

    const coloropts = product.coloropts ?? [];
    const hasVariants = resolveHasVariants(product, baseTitleCounts);

    for (const colorOption of coloropts) {
      const offer = buildOfferXml(product, colorOption, baseUrl, hasVariants, category);
      if (offer) offers.push(offer);
    }
  }

  const categories = Array.from(categoriesById.entries())
    .map(([id, name]) => `      <category id="${escapeXml(id)}">${escapeXml(name)}</category>`)
    .join("\n");

  const now = new Date();
  const date = now.toISOString().slice(0, 16).replace("T", " ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${date}">
  <shop>
    <name>Kondor Device</name>
    <company>Kondor</company>
    <url>${escapeXml(baseUrl)}</url>
    <currencies>
      <currency id="${CURRENCY}" rate="1"/>
    </currencies>
    <categories>
${categories}
    </categories>
    <offers>
      ${offers.join("\n      ")}
    </offers>
  </shop>
</yml_catalog>
`;
}

export async function GET() {
  try {
    const products = await fetchFeedProducts();
    const baseUrl = getBaseUrl();
    const xml = buildFeedXml(products, baseUrl);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Failed to generate Rozetka product feed:", error);
    return NextResponse.json(
      { error: "Failed to generate Rozetka product feed" },
      { status: 500 }
    );
  }
}
