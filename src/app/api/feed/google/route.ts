import { NextResponse } from "next/server";
import {
  BRAND,
  CURRENCY,
  FeedColorOption,
  FeedProduct,
  buildAvailability,
  buildBaseTitleCounts,
  buildLink,
  buildTitle,
  buildVariantId,
  escapeXml,
  fetchFeedProducts,
  getBaseUrl,
  getVariantColor,
  resolveHasVariants,
  toFeedImageUrl,
  toPlainDescription,
} from "@/lib/feed";

// Той самий підхід до кешування, що й у /api/feed/meta та /api/feed/rozetka —
// див. коментар там. Достроково фід можна скинути через
// POST /api/revalidate?secret=...
export const dynamic = "force-static";
export const revalidate = 3600;

function buildItemXml(
  product: FeedProduct,
  colorOption: FeedColorOption,
  baseUrl: string,
  hasVariants: boolean
): string | null {
  const photos = colorOption.photos ?? [];
  const [mainPhoto, ...restPhotos] = photos;

  // Без зображення офер не пройде валідацію Google Merchant — пропускаємо
  // такий варіант, як і в фідах Meta/Rozetka.
  if (!mainPhoto?.url) return null;

  const color = getVariantColor(colorOption);
  const id = buildVariantId(colorOption);
  const title = buildTitle(product, color, hasVariants);
  const description = toPlainDescription(product.description) || title;
  const availability = buildAvailability(product);
  const actualPrice =
    product.priceDiscount && product.priceDiscount < product.price
      ? product.priceDiscount
      : null;

  const fields: string[] = [
    `<g:id>${escapeXml(id)}</g:id>`,
    `<g:item_group_id>${escapeXml(product.id)}</g:item_group_id>`,
    `<g:title>${escapeXml(title)}</g:title>`,
    `<g:description>${escapeXml(description)}</g:description>`,
    `<g:link>${escapeXml(buildLink(baseUrl, product.slug, color))}</g:link>`,
    `<g:image_link>${escapeXml(toFeedImageUrl(mainPhoto.url))}</g:image_link>`,
    // Google Merchant Center дозволяє до 10 додаткових зображень на офер
    // (менше, ніж у Meta, де ліміт 20) — див.
    // https://support.google.com/merchants/answer/6324370
    ...restPhotos
      .slice(0, 10)
      .map(
        (photo) =>
          `<g:additional_image_link>${escapeXml(toFeedImageUrl(photo.url))}</g:additional_image_link>`
      ),
    `<g:color>${escapeXml(color)}</g:color>`,
    ...(product.cat?.name
      ? [`<g:product_type>${escapeXml(product.cat.name)}</g:product_type>`]
      : []),
    `<g:brand>${escapeXml(BRAND)}</g:brand>`,
    `<g:condition>new</g:condition>`,
    `<g:availability>${availability}</g:availability>`,
    `<g:price>${product.price.toFixed(2)} ${CURRENCY}</g:price>`,
    ...(actualPrice !== null
      ? [`<g:sale_price>${actualPrice.toFixed(2)} ${CURRENCY}</g:sale_price>`]
      : []),
    // У Sanity немає полів GTIN/MPN — без identifier_exists="no" Google
    // Merchant відхиляє офер як такий, що має бракуючий унікальний
    // ідентифікатор товару. Явно повідомляємо, що GTIN/MPN у цього товару
    // не існує (це нормальна ситуація для товарів власного бренду без
    // штрихкоду в базі).
    `<g:identifier_exists>no</g:identifier_exists>`,
  ];

  return `<item>\n${fields.map((field) => `      ${field}`).join("\n")}\n    </item>`;
}

function buildFeedXml(products: FeedProduct[], baseUrl: string): string {
  const feedUrl = new URL("api/feed/google", baseUrl).toString();
  const baseTitleCounts = buildBaseTitleCounts(products);

  const items = products
    .flatMap((product) => {
      const coloropts = product.coloropts ?? [];
      const hasVariants = resolveHasVariants(product, baseTitleCounts);
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
    <description>Динамічний фід каталогу товарів Kondor Device для Google Merchant Center</description>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    ${items.join("\n    ")}
  </channel>
</rss>
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
    console.error("Failed to generate Google Merchant product feed:", error);
    return NextResponse.json(
      { error: "Failed to generate Google Merchant product feed" },
      { status: 500 }
    );
  }
}
