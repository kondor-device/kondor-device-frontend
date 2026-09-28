import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanityWriteClient";
import { isConfiguredChat, telegramCall } from "@/lib/telegram";
import {
  buildReviewMessage,
  parseCallbackData,
  ReviewStatus,
} from "@/lib/reviewMessage";
import { revalidateProductWithRating } from "@/lib/revalidate";

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
}

interface CallbackQuery {
  id: string;
  from: TelegramUser;
  data?: string;
  message?: {
    message_id: number;
    chat: { id: number; username?: string };
  };
}

interface ReviewDoc {
  _id: string;
  _rev: string;
  status: ReviewStatus;
  author: string;
  phone?: string;
  rating: number;
  text: string;
  moderatedBy?: string;
  itemName: string;
  itemSlug?: string;
  categorySlug?: string;
}

const REVIEW_QUERY = `*[_type == "review" && _id == $id][0]{
  _id, _rev, status, author, phone, rating, text, moderatedBy,
  "itemName": coalesce(item->generalname + " " + item->name, item->name, ""),
  "itemSlug": item->slug,
  "categorySlug": item->cat->slug
}`;

// Збій answerCallbackQuery (наприклад, запит уже застарів) не має блокувати
// ні зміну статусу, ні оновлення повідомлення в каналі
const answer = async (id: string, text: string) => {
  try {
    await telegramCall("answerCallbackQuery", {
      callback_query_id: id,
      text,
      show_alert: false,
    });
  } catch (error) {
    console.error("[telegram webhook] answerCallbackQuery failed:", error);
  }
};

const formatModerator = (user: TelegramUser) =>
  user.username ? `@${user.username}` : `${user.first_name ?? "id"} ${user.id}`;

function productUrl(review: ReviewDoc) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return baseUrl && review.categorySlug && review.itemSlug
    ? `${baseUrl}catalog/${review.categorySlug}/${review.itemSlug}`
    : undefined;
}

// Оновлюємо повідомлення в каналі: показуємо рішення і прибираємо кнопки
async function updateMessage(
  cq: CallbackQuery,
  review: ReviewDoc,
  status: ReviewStatus,
  moderatedBy?: string
) {
  if (!cq.message) return;

  try {
    await editMessage(cq, review, status, moderatedBy);
  } catch (error) {
    // Рішення вже збережене в Sanity; повідомлення в каналі — лише індикація
    console.error("[telegram webhook] editMessageText failed:", error);
  }
}

async function editMessage(
  cq: CallbackQuery,
  review: ReviewDoc,
  status: ReviewStatus,
  moderatedBy?: string
) {
  if (!cq.message) return;

  const { text, reply_markup } = buildReviewMessage(
    {
      id: review._id,
      author: review.author,
      phone: review.phone,
      rating: review.rating,
      text: review.text,
      itemName: review.itemName,
      productUrl: productUrl(review),
    },
    status,
    moderatedBy
  );

  await telegramCall("editMessageText", {
    chat_id: cq.message.chat.id,
    message_id: cq.message.message_id,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    text,
    reply_markup,
  });
}

async function handleCallback(cq: CallbackQuery) {
  const parsed = parseCallbackData(cq.data);

  // Не наші кнопки — ігноруємо
  if (!parsed) return;

  // Натиснули не в налаштованому каналі: не мовчимо, а логуємо і показуємо
  // модератору, щоб помилку в TELEGRAM_CHAT_ID було видно одразу
  if (!isConfiguredChat(cq.message?.chat)) {
    console.warn(
      "[telegram webhook] Callback from unexpected chat:",
      cq.message?.chat?.id,
      cq.message?.chat?.username
    );
    await answer(
      cq.id,
      "Не вдалося опрацювати: перевірте TELEGRAM_CHAT_ID на сервері"
    );
    return;
  }

  const review = await writeClient.fetch<ReviewDoc | null>(
    REVIEW_QUERY,
    { id: parsed.id },
    { cache: "no-store" }
  );

  if (!review) {
    await answer(cq.id, "Відгук не знайдено");
    return;
  }

  // Рішення вже ухвалене (повторний клік або інший модератор) — не перезаписуємо
  if (review.status !== "pending") {
    await answer(cq.id, "Вже опрацьовано");
    await updateMessage(cq, review, review.status, review.moderatedBy);
    return;
  }

  const status: ReviewStatus =
    parsed.action === "approve" ? "approved" : "rejected";
  const moderatedBy = formatModerator(cq.from);

  try {
    // ifRevisionID: якщо документ змінився між читанням і записом
    // (паралельний клік), запис відхилиться замість перезапису рішення
    await writeClient
      .patch(review._id)
      .ifRevisionId(review._rev)
      .set({
        status,
        moderatedAt: new Date().toISOString(),
        moderatedBy,
      })
      .commit();
  } catch {
    await answer(cq.id, "Вже опрацьовано іншим модератором");
    return;
  }

  await answer(
    cq.id,
    status === "approved" ? "Відгук схвалено" : "Відгук відхилено"
  );
  await updateMessage(cq, review, status, moderatedBy);

  if (status === "approved" && review.itemSlug) {
    await revalidateProductWithRating(review.itemSlug, review.categorySlug);
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (
    !secret ||
    request.headers.get("x-telegram-bot-api-secret-token") !== secret
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const update = await request.json();

    if (update?.callback_query) {
      await handleCallback(update.callback_query as CallbackQuery);
    }
  } catch (error) {
    // Відповідаємо 200, щоб Telegram не ретраїв; кнопки лишаються, модератор
    // може натиснути ще раз.
    console.error("[telegram webhook] Failed to handle update:", error);
  }

  return NextResponse.json({ ok: true });
}
