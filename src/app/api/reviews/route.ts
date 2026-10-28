import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { writeClient } from "@/lib/sanityWriteClient";
import { telegramCall } from "@/lib/telegram";
import { buildReviewMessage } from "@/lib/reviewMessage";
import { reviewValidation } from "@/schemas/reviewValidation";
import { InvalidReviewUpload, normalizeReviewPhoto, readReviewSubmission } from "@/lib/reviewUpload";
import { PUBLIC_REVIEW_FIELDS, REVIEW_PAGE_SIZE, REVIEW_PHOTO_ORDER } from "@/lib/reviewPhotos";
import { client } from "@/lib/sanityClient";

export const runtime = "nodejs";

const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Скільки відгуків з одного номера телефону дозволено за 24 години
const MAX_REVIEWS_PER_DAY = 3;
// Швидше за це людина форму не заповнить — це бот
const MIN_FILL_TIME_MS = 3000;

interface ItemInfo {
  name: string;
  slug: string;
  categorySlug?: string;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  let photos: File[];

  try {
    const submission = await readReviewSubmission(request);
    body = submission.fields;
    photos = submission.photos;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { itemId, locale, website, startedAt } = body;

  // Антиспам: honeypot заповнений або форму відправили занадто швидко —
  // вдаємо успіх, нічого не зберігаючи, щоб бот не підлаштовувався.
  const filledTooFast =
    typeof startedAt === "number" && Date.now() - startedAt < MIN_FILL_TIME_MS;

  if (website || filledTooFast) {
    return NextResponse.json({ ok: true });
  }

  let values;
  try {
    values = await reviewValidation().validate(body, { abortEarly: false });
  } catch {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  if (typeof itemId !== "string" || !itemId) {
    return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
  }

  try {
    const item = await writeClient.fetch<ItemInfo | null>(
      `*[_type == "item" && _id == $itemId][0]{
        "name": coalesce(generalname + " " + name, name),
        "slug": slug,
        "categorySlug": cat->slug
      }`,
      { itemId },
    );

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Ліміти рахуємо по Sanity: на serverless in-memory лічильник не живе між викликами
    const { sameItem, lastDay } = await writeClient.fetch<{
      sameItem: number;
      lastDay: number;
    }>(
      `{
        "sameItem": count(*[_type in ["review", "reviewContact"] && phone == $phone && item._ref == $itemId]),
        "lastDay": count(*[_type in ["review", "reviewContact"] && phone == $phone && submittedAt > $since])
      }`,
      {
        phone: values.phone,
        itemId,
        since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      { cache: "no-store" },
    );

    if (sameItem > 0) {
      return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
    }

    if (lastDay >= MAX_REVIEWS_PER_DAY) {
      return NextResponse.json({ error: "Too many reviews" }, { status: 429 });
    }

    // Decode all files before creating assets or review documents.
    const normalized = await Promise.all(photos.map(normalizeReviewPhoto));
    const uploaded = [];
    for (const bytes of normalized) {
      const asset = await writeClient.assets.upload("image", bytes, { contentType: "image/webp", filename: "review.webp" });
      uploaded.push({ _type: "image", _key: randomUUID(), asset: { _type: "reference", _ref: asset._id } });
    }
    const submittedAt = new Date().toISOString();
    const created = {
      _id: randomUUID(),
      _type: "review",
      item: { _type: "reference", _ref: itemId },
      author: values.name,
      rating: values.rating,
      text: values.message,
      status: "pending",
      submittedAt,
      locale: locale === "ru" ? "ru" : "uk",
      ...(uploaded.length ? { photos: uploaded } : {}),
    };
    // Dotted IDs are private in a public Sanity dataset. Never put phone numbers
    // in the public review document; keep both records in one atomic transaction.
    await writeClient.transaction().create(created).create({
      _id: `reviewContact.${created._id}`,
      _type: "reviewContact",
      reviewId: created._id,
      item: created.item,
      phone: values.phone,
      submittedAt,
    }).commit();

    // Відгук уже збережений зі статусом pending (модерувати можна і зі Studio),
    // тож збій Telegram не має ламати відповідь користувачу.
    try {
      const host = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
      const baseUrl = host ? `https://${host}/` : process.env.NEXT_PUBLIC_BASE_URL;
      const message = buildReviewMessage(
        {
          id: created._id,
          author: values.name,
          phone: values.phone,
          rating: values.rating,
          text: values.message,
          itemName: item.name,
          productUrl:
            baseUrl && item.categorySlug
              ? `${baseUrl}catalog/${item.categorySlug}/${item.slug}`
              : undefined,
        },
        "pending",
      );

      const sent = await telegramCall<{ message_id: number }>("sendMessage", {
        chat_id: CHAT_ID,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        ...message,
      });

      await writeClient
        .patch(created._id)
        .set({ telegramMessageId: sent.message_id })
        .commit();
    } catch {
      console.error("[reviews] Failed to notify Telegram");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof InvalidReviewUpload) return NextResponse.json({ error: "Invalid photos" }, { status: 400 });
    console.error("[reviews] Failed to save review");
    return NextResponse.json(
      { error: "Failed to save review" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const itemId = request.nextUrl.searchParams.get("itemId") || "";
  const offsetText = request.nextUrl.searchParams.get("offset") || "0";
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(itemId) || !/^\d{1,5}$/.test(offsetText)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const offset = Number(offsetText);
  if (offset > 10000) return NextResponse.json({ error: "Invalid offset" }, { status: 400 });
  try {
    const reviews = await client.withConfig({ useCdn: false, perspective: "published", token: undefined }).fetch(
      `*[_type=="review" && status=="approved" && item._ref==$itemId && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | ${REVIEW_PHOTO_ORDER}[${offset}...${offset + REVIEW_PAGE_SIZE + 1}]{${PUBLIC_REVIEW_FIELDS}}`,
      { itemId }, { cache: "no-store" },
    );
    return NextResponse.json({ reviews: reviews.slice(0, REVIEW_PAGE_SIZE), hasMore: reviews.length > REVIEW_PAGE_SIZE }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Could not load reviews" }, { status: 503 }); }
}
