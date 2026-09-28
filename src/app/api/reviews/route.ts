import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanityWriteClient";
import { telegramCall } from "@/lib/telegram";
import { buildReviewMessage } from "@/lib/reviewMessage";
import { reviewValidation } from "@/schemas/reviewValidation";

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

  try {
    body = await request.json();
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
        "sameItem": count(*[_type == "review" && phone == $phone && item._ref == $itemId]),
        "lastDay": count(*[_type == "review" && phone == $phone && submittedAt > $since])
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

    const created = await writeClient.create({
      _type: "review",
      item: { _type: "reference", _ref: itemId },
      author: values.name,
      phone: values.phone,
      rating: values.rating,
      text: values.message,
      status: "pending",
      submittedAt: new Date().toISOString(),
      locale: locale === "ru" ? "ru" : "uk",
    });

    // Відгук уже збережений зі статусом pending (модерувати можна і зі Studio),
    // тож збій Telegram не має ламати відповідь користувачу.
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
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
    } catch (error) {
      console.error("[reviews] Failed to notify Telegram:", error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[reviews] Failed to save review:", error);
    return NextResponse.json(
      { error: "Failed to save review" },
      { status: 500 },
    );
  }
}
