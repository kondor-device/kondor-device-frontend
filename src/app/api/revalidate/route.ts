import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";

// Ендпоінт для дострокового скидання кешу товарних фідів одразу після
// публікації/зміни товару в Sanity Studio (замість очікування до 1 години
// на автоматичну ревалідацію через `revalidate` у самому роуті фіда).
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

interface SanityWebhookPayload {
  _type?: string;
  _id?: string;
  slug?: string;
}

const REVALIDATED_PATHS = [
  "/api/feed/meta",
  "/api/feed/rozetka",
  "/api/feed/google",
];

function revalidateFeeds() {
  REVALIDATED_PATHS.forEach((path) => revalidatePath(path));
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

    revalidateFeeds();

    return NextResponse.json({
      revalidated: true,
      paths: REVALIDATED_PATHS,
      documentType: body?._type,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Failed to revalidate feeds:", error);
    return NextResponse.json(
      { revalidated: false, message: "Error revalidating" },
      { status: 500 }
    );
  }
}

// GET — для ручного/тестового тригера з браузера (звичайний секрет у query,
// оскільки GET-запит із браузера не може нести підпис Sanity).
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    revalidateFeeds();
    return NextResponse.json({
      revalidated: true,
      paths: REVALIDATED_PATHS,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Failed to revalidate feeds:", error);
    return NextResponse.json(
      { revalidated: false, message: "Error revalidating" },
      { status: 500 }
    );
  }
}
