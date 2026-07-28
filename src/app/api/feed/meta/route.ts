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
  toPlainDescription,
} from "@/lib/feed";

// У Next.js 15 GET Route Handler'и за замовчуванням НЕ кешуються — кожен
// запит бив би напряму в Sanity API (в т.ч. кожен захід бота Meta/Rozetka).
// "force-static" явно вмикає ISR-кешування для цього роуту: відповідь
// генерується один раз і віддається з кешу, а у фоні перегенеровується не
// частіше ніж раз на годину (revalidate нижче).
// Достроково (одразу після зміни товару в адмінці) кеш можна скинути через
// POST /api/revalidate?secret=... — див. src/app/api/revalidate/route.ts.
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

  // Без зображення офер не пройде валідацію Meta — пропускаємо такий варіант.
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
    <description>Динамічний фід каталогу товарів Kondor Device для Meta/Facebook Catalog</description>
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
    console.error("Failed to generate Meta product feed:", error);
    return NextResponse.json(
      { error: "Failed to generate Meta product feed" },
      { status: 500 }
    );
  }
}
