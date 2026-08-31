import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { routing } from "@/i18n/routing";
import { client } from "@/lib/sanityClient";

// Ендпоінт для дострокового скидання кешу товарних фідів і сторінок сайту
// одразу після публікації/зміни товару в Sanity Studio (замість очікування
// до 1 години на автоматичну ревалідацію через `revalidate` у layout).
//
// Налаштування на боці Sanity (робиться один раз в manage.sanity.io):
//   Project -> API -> Webhooks -> Create webhook
//   URL:      https://www.kondor.ua/api/revalidate   (без ?secret= у самому URL!)
//   Dataset:  production
//   Trigger:  Create / Update / Delete
//   Filter:   _type == "item"
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

interface SanitySlug {
  current?: string;
}

interface SanityWebhookPayload {
  _type?: string;
  _id?: string;
  slug?: string | SanitySlug;
}

const FEED_PATHS = [
  "/api/feed/meta",
  "/api/feed/rozetka",
  "/api/feed/google",
] as const;

function getLocalizedPaths(pathname: string): string[] {
  const paths = [pathname];

  routing.locales.forEach((locale) => {
    if (locale === routing.defaultLocale) {
      return;
    }

    paths.push(`/${locale}${pathname === "/" ? "" : pathname}`);
  });

  return paths;
}

function revalidatePaths(paths: string[]): string[] {
  const revalidated = new Set<string>();

  paths.forEach((path) => {
    revalidatePath(path);
    revalidated.add(path);
  });

  return [...revalidated];
}

function revalidateFeeds(): string[] {
  return revalidatePaths([...FEED_PATHS]);
}

function revalidateSitePages(): string[] {
  return revalidatePaths([
    ...getLocalizedPaths("/"),
    ...getLocalizedPaths("/catalog"),
  ]);
}

function revalidateProductPage(slug: string): string[] {
  return revalidatePaths(getLocalizedPaths(`/catalog/${slug}`));
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

async function revalidateOnItemChange(
  body?: SanityWebhookPayload
): Promise<{ paths: string[]; productSlug: string | null }> {
  const productSlug = await resolveProductSlug(body);
  const paths = [...revalidateFeeds(), ...revalidateSitePages()];

  if (productSlug) {
    paths.push(...revalidateProductPage(productSlug));
  }

  return { paths, productSlug };
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

    const { paths, productSlug } = await revalidateOnItemChange(body ?? undefined);

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
