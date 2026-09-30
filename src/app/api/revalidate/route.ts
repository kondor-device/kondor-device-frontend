import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { routing } from "@/i18n/routing";
import { client } from "@/lib/sanityClient";
import { SITE_SEO_CONFIG, type SiteSeoPageId } from "@/lib/seo/siteSeoConfig";

// Ендпоінт для дострокового скидання кешу товарних фідів і сторінок сайту
// одразу після публікації/зміни товару в Sanity Studio (замість очікування
// до 1 години на автоматичну ревалідацію через `revalidate` у layout).
//
// Налаштування на боці Sanity (робиться один раз в manage.sanity.io):
//   Project -> API -> Webhooks -> Create webhook
//   URL:      https://www.kondor.ua/api/revalidate   (без ?secret= у самому URL!)
//   Dataset:  production
//   Trigger:  Create / Update / Delete
//   Filter:   _type in ["item", "bundle", "category", "seoHomePage", "seoCatalogPage",
//             "seoAboutPage", "seoDeliveryPage", "seoReturnsPage", "seoWarrantyPage", "seoPolicyPage"]
//   HTTP method: POST
//   Secret:   те саме значення, що і в SANITY_REVALIDATE_SECRET
//
// Sanity НЕ додає значення поля "Secret" до URL — натомість підписує тіло
// запиту HMAC-SHA256 цим секретом і кладе підпис у заголовок
// `sanity-webhook-signature`. `parseBody` з `next-sanity/webhook` сам
// вичитує сирий body і звіряє цей підпис із SANITY_REVALIDATE_SECRET.
//
// SANITY_REVALIDATE_SECRET має бути заданий в env (.env.local та у Vercel)
// і збігатись зі значенням поля "Secret" у налаштуваннях вебхука в Sanity.
//
// Що скидається залежно від типу документа:
//   item, bundle — фіди, sitemap, головна і весь /catalog (разом із сторінкою товару);
//   category     — те саме (назва й slug категорії є в меню, футері та фідах);
//   seo*Page     — тег `site-seo:<_id>`, сама сторінка і sitemap (lastmod).
// Якщо тип невідомий (наприклад, payload видаленого документа без `_type`) — скидаємо все.
//
// Зміна `bundle` (сету) або `outOfStock`/ціни товару-компонента скидає layout /catalog:
// разом зі списками він охоплює і всі сторінки сетів.
//
// Важливо для next-intl + localePrefix: "as-needed":
// кеш сторінки може бути під публічним URL (`/`) АБО під внутрішнім
// шляхом з локаллю (`/uk`). Тому ревалідуємо обидва варіанти. Тип "layout"
// також скидає layout-рівень ISR (`export const revalidate = 3600`).

interface SanitySlug {
  current?: string;
}

interface SanityWebhookPayload {
  _type?: string;
  _id?: string;
  slug?: string | SanitySlug;
}

const SITEMAP_PATH = "/api/sitemap";

const FEED_PATHS = [
  "/api/feed/meta",
  "/api/feed/rozetka",
  "/api/feed/google",
] as const;

function getLocalizedPaths(pathname: string): string[] {
  const paths = new Set<string>();

  // Публічний URL без префікса (localePrefix: "as-needed")
  paths.add(pathname);

  // Внутрішній шлях App Router з [locale] — саме він часто є ключем кешу
  // після static generation / ISR, включно для defaultLocale.
  routing.locales.forEach((locale) => {
    paths.add(`/${locale}${pathname === "/" ? "" : pathname}`);
  });

  return [...paths];
}

function revalidatePaths(
  paths: string[],
  type: "page" | "layout" = "page"
): string[] {
  const revalidated = new Set<string>();

  paths.forEach((path) => {
    revalidatePath(path, type);
    revalidated.add(`${path} (${type})`);
  });

  return [...revalidated];
}

function revalidateFeeds(): string[] {
  return revalidatePaths([...FEED_PATHS]);
}

function revalidateSitePages(): string[] {
  // layout — щоб скинути ISR layout (`revalidate = 3600`) і вкладені сторінки
  return [
    ...revalidatePaths(getLocalizedPaths("/"), "layout"),
    ...revalidatePaths(getLocalizedPaths("/catalog"), "layout"),
  ];
}

function revalidateProductPage(
  slug: string,
  categorySlug: string | null
): string[] {
  const paths = [
    // Легасі-редірект /catalog/[product] (без категорії в URL)
    ...revalidatePaths(getLocalizedPaths(`/catalog/${slug}`), "page"),
  ];

  if (categorySlug) {
    paths.push(
      ...revalidatePaths(
        getLocalizedPaths(`/catalog/${categorySlug}/${slug}`),
        "page"
      ),
      // Категорія теж може змінити свій вміст (наприклад, товар щойно
      // опублікували в цій категорії)
      ...revalidatePaths(getLocalizedPaths(`/catalog/${categorySlug}`), "page")
    );
  }

  return paths;
}

function extractSlugFromPayload(body: SanityWebhookPayload): string | null {
  if (typeof body.slug === "string" && body.slug.length > 0) {
    return body.slug;
  }

  if (
    body.slug &&
    typeof body.slug === "object" &&
    typeof body.slug.current === "string" &&
    body.slug.current.length > 0
  ) {
    return body.slug.current;
  }

  return null;
}

async function resolveProductSlug(
  body?: SanityWebhookPayload
): Promise<string | null> {
  if (!body) {
    return null;
  }

  const slugFromPayload = extractSlugFromPayload(body);
  if (slugFromPayload) {
    return slugFromPayload;
  }

  if (!body._id) {
    return null;
  }

  const document = await client.fetch<{ slug?: SanitySlug }>(
    `*[_id == $id][0]{ slug }`,
    { id: body._id },
    { cache: "no-store" }
  );

  return document?.slug?.current ?? null;
}

async function resolveProductCategorySlug(
  productSlug: string
): Promise<string | null> {
  const category = await client.fetch<{ slug?: string } | null>(
    `*[_type == "item" && slug == $slug][0]{ "slug": cat->slug }`,
    { slug: productSlug },
    { cache: "no-store" }
  );

  return category?.slug ?? null;
}

async function revalidateOnItemChange(
  body?: SanityWebhookPayload
): Promise<{ paths: string[]; productSlug: string | null }> {
  const productSlug = await resolveProductSlug(body);
  const paths = [
    ...revalidateFeeds(),
    ...revalidatePaths([SITEMAP_PATH]),
    ...revalidateSitePages(),
  ];

  if (productSlug) {
    const categorySlug = await resolveProductCategorySlug(productSlug);
    paths.push(...revalidateProductPage(productSlug, categorySlug));
  }

  return { paths, productSlug };
}

function isSeoPageId(id?: string): id is SiteSeoPageId {
  return Boolean(id) && Object.hasOwn(SITE_SEO_CONFIG, id as string);
}

// SEO document of a static page: its own cached data and the page itself
function revalidateSeoPage(pageId: SiteSeoPageId): string[] {
  revalidateTag("site-seo");
  revalidateTag(`site-seo:${pageId}`);

  return [
    `tag: site-seo:${pageId}`,
    ...revalidatePaths(getLocalizedPaths(SITE_SEO_CONFIG[pageId].path)),
    ...revalidatePaths([SITEMAP_PATH]),
  ];
}

async function revalidateOnChange(body?: SanityWebhookPayload): Promise<{
  paths: string[];
  productSlug: string | null;
}> {
  const id = body?._id?.replace(/^drafts\./, "");

  if (isSeoPageId(id)) {
    return { paths: revalidateSeoPage(id), productSlug: null };
  }

  return revalidateOnItemChange(body);
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "Missing SANITY_REVALIDATE_SECRET env variable" },
      { status: 500 }
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
      request,
      secret
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const { paths, productSlug } = await revalidateOnChange(
      body ?? undefined
    );

    return NextResponse.json({
      revalidated: true,
      paths,
      productSlug,
      documentType: body?._type,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Failed to revalidate:", error);
    return NextResponse.json(
      { revalidated: false, message: "Error revalidating" },
      { status: 500 }
    );
  }
}

// GET — для ручного/тестового тригера з браузера (звичайний секрет у query,
// оскільки GET-запит із браузера не може нести підпис Sanity).
// Опційно: ?slug=my-product — ревалідувати конкретну сторінку товару.
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Manual trigger: also drop the cached SEO documents of the static pages
    revalidateTag("site-seo");

    const slug = request.nextUrl.searchParams.get("slug");
    const body = slug ? { slug } satisfies SanityWebhookPayload : undefined;
    const { paths, productSlug } = await revalidateOnItemChange(body);

    return NextResponse.json({
      revalidated: true,
      paths,
      productSlug,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Failed to revalidate:", error);
    return NextResponse.json(
      { revalidated: false, message: "Error revalidating" },
      { status: 500 }
    );
  }
}
