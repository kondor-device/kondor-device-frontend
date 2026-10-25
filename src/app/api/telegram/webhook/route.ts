import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { writeClient } from "@/lib/sanityWriteClient";
import { isConfiguredChat, telegramCall } from "@/lib/telegram";
import { buildReviewMessage, parseCallbackData, ReviewStatus } from "@/lib/reviewMessage";
import { revalidateProductWithRating } from "@/lib/revalidate";

export const runtime = "nodejs";

interface TelegramUser { id: number; username?: string; first_name?: string }
interface Message {
  message_id: number;
  chat: { id: number; type?: string; username?: string };
  from?: TelegramUser;
  text?: string;
  reply_to_message?: { message_id: number };
}
interface CallbackQuery { id: string; from: TelegramUser; data?: string; message?: Message }
interface ReviewDoc {
  _id: string; _rev: string; status: ReviewStatus;
  author: string; phone?: string; rating: number; text: string;
  moderatedBy?: string; itemName: string; itemSlug?: string; categorySlug?: string;
  telegramMessageId?: number;
  reply?: { text: string; publishedAt: string; telegramUpdateId: number; repliedBy: string };
}
interface ReplySession {
  _id: string; _rev: string; reviewId: string; promptMessageId: number;
  expiresAt: string; reviewRevision: string;
}
const REVIEW_QUERY = `*[_type == "review" && _id == $id][0]{
  _id, _rev, status, author, phone, rating, text, moderatedBy, telegramMessageId, reply,
  "itemName": coalesce(item->generalname + " " + item->name, item->name, ""),
  "itemSlug": item->slug, "categorySlug": item->cat->slug
}`;
const getReview = (id: string) => writeClient.fetch<ReviewDoc | null>(
  REVIEW_QUERY, { id }, { cache: "no-store" },
);
const formatModerator = (user: TelegramUser) =>
  user.username ? `@${user.username}` : `${user.first_name ?? "id"} ${user.id}`;
const isConflict = (error: unknown) =>
  !!error && typeof error === "object" && "statusCode" in error && error.statusCode === 409;

async function answer(id: string, text: string) {
  try {
    await telegramCall("answerCallbackQuery", { callback_query_id: id, text });
  } catch {
    // An expired callback must not undo a saved decision.
    console.warn("[reviews] Callback acknowledgement expired or unavailable");
  }
}

async function isModerator(userId: number) {
  const member = await telegramCall<{ status: string }>("getChatMember", {
    chat_id: process.env.TELEGRAM_CHAT_ID, user_id: userId,
  });
  return member.status === "creator" || member.status === "administrator";
}

function productUrl(review: ReviewDoc) {
  const host = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
  const base = host ? `https://${host}/` : process.env.NEXT_PUBLIC_BASE_URL;
  return base && review.categorySlug && review.itemSlug
    ? `${base}catalog/${review.categorySlug}/${review.itemSlug}#reviews` : undefined;
}

async function refreshReview(review: ReviewDoc, message?: Message) {
  // Retry invalidation too: the previous delivery might have saved the decision.
  if (review.itemSlug) await revalidateProductWithRating(review.itemSlug, review.categorySlug);
  const messageId = message?.message_id ?? review.telegramMessageId;
  if (!messageId) return;
  const bot = review.status === "approved"
    ? await telegramCall<{ username: string }>("getMe", {}) : undefined;
  const content = buildReviewMessage({
    id: review._id, author: review.author, phone: review.phone,
    rating: review.rating, text: review.text, itemName: review.itemName,
    productUrl: productUrl(review), reply: review.reply, botUsername: bot?.username,
  }, review.status, review.moderatedBy);
  try {
    await telegramCall("editMessageText", {
      chat_id: message?.chat.id ?? process.env.TELEGRAM_CHAT_ID,
      message_id: messageId, parse_mode: "HTML", disable_web_page_preview: true, ...content,
    });
  } catch (error) {
    if (error instanceof Error && /message is not modified|message to edit not found/i.test(error.message)) return;
    throw error;
  }
}

async function handleCallback(cq: CallbackQuery) {
  const parsed = parseCallbackData(cq.data);
  if (!parsed) return;
  if (!isConfiguredChat(cq.message?.chat)) {
    await answer(cq.id, "Ці кнопки працюють лише в каналі модерації"); return;
  }
  if (!await isModerator(cq.from.id)) {
    await answer(cq.id, "Модерація доступна лише адміністраторам каналу"); return;
  }
  let review = await getReview(parsed.id);
  if (!review) { await answer(cq.id, "Відгук не знайдено"); return; }
  if (review.status === "pending") {
    const changes = {
      status: (parsed.action === "approve" ? "approved" : "rejected") as ReviewStatus,
      moderatedAt: new Date().toISOString(), moderatedBy: formatModerator(cq.from),
    };
    try {
      await writeClient.patch(review._id).ifRevisionId(review._rev).set(changes).commit();
      review = { ...review, ...changes };
    } catch (error) {
      if (!isConflict(error)) throw error;
      review = await getReview(parsed.id);
      if (!review) { await answer(cq.id, "Відгук не знайдено"); return; }
      if (review.status === "pending") throw error;
    }
  }
  await answer(cq.id, review.status === "approved" ? "Відгук схвалено" : "Відгук відхилено");
  await refreshReview(review, cq.message);
}

const sendPrivate = (chatId: number, text: string, extra: Record<string, unknown> = {}) =>
  telegramCall<{ message_id: number }>("sendMessage", { chat_id: chatId, text, ...extra });

async function handleMessage(message: Message, updateId: number) {
  if (message.chat.type !== "private" || !message.from || message.from.id !== message.chat.id) return;
  const start = message.text?.match(/^\/start(?:@\w+)? reply_([A-Za-z0-9_-]{1,58})$/);
  const sessionId = `reviewReplySession.${message.from.id}`;
  const session = await writeClient.fetch<ReplySession | null>(
    `*[_type == "reviewReplySession" && _id == $id][0]`, { id: sessionId }, { cache: "no-store" },
  );
  // Leave unrelated messages alone: the bot can serve other workflows.
  if (!start && !session) return;
  if (!await isModerator(message.from.id)) {
    await sendPrivate(message.chat.id, "Відповідати на відгуки можуть лише адміністратори каналу."); return;
  }
  if (message.text === "/cancel") {
    if (session) await writeClient.delete(sessionId);
    await sendPrivate(message.chat.id, "Відповідь скасовано."); return;
  }
  if (start) {
    const review = await getReview(start[1]);
    if (!review || review.status !== "approved") {
      await sendPrivate(message.chat.id, "Спочатку схваліть відгук у каналі."); return;
    }
    const prompt = await sendPrivate(message.chat.id,
      `Відповідь Kondor на відгук ${review.author} про ${review.itemName}:\n\n${review.text}\n\nНапишіть відповідь на це повідомлення (2–1000 символів). Вона з’явиться на сайті. /cancel — скасувати.`,
      { reply_markup: { force_reply: true, input_field_placeholder: "Відповідь від Kondor" } },
    );
    await writeClient.createOrReplace({
      _id: sessionId, _type: "reviewReplySession", reviewId: review._id,
      reviewRevision: review._rev, promptMessageId: prompt.message_id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
    return;
  }
  if (!session) return;
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await sendPrivate(message.chat.id, "Час очікування минув. Натисніть «Відповісти» у каналі ще раз."); return;
  }
  if (message.reply_to_message?.message_id !== session.promptMessageId) {
    await sendPrivate(message.chat.id, "Надішліть текст як відповідь на запит бота або натисніть «Відповісти» у каналі ще раз."); return;
  }
  const text = message.text?.trim();
  if (!text || text.length < 2 || text.length > 1000) {
    await sendPrivate(message.chat.id, "Потрібна текстова відповідь від 2 до 1000 символів."); return;
  }
  let review = await getReview(session.reviewId);
  if (!review || review.status !== "approved") {
    await sendPrivate(message.chat.id, "Відгук не схвалений або вже видалений."); return;
  }
  // Retries cannot overwrite another moderator's newer reply.
  if (review.reply?.telegramUpdateId !== updateId) {
    if (review._rev !== session.reviewRevision) {
      await sendPrivate(message.chat.id, "Відгук уже змінено. Відкрийте «Змінити відповідь» у каналі, щоб побачити актуальний стан."); return;
    }
    const reply = { text, publishedAt: new Date().toISOString(), repliedBy: formatModerator(message.from), telegramUpdateId: updateId };
    try {
      await writeClient.patch(review._id).ifRevisionId(review._rev).set({ reply }).commit();
      review = { ...review, reply };
    } catch (error) {
      if (!isConflict(error)) throw error;
      await sendPrivate(message.chat.id, "Інший адміністратор уже змінив відгук. Відкрийте його з каналу ще раз."); return;
    }
  }
  await refreshReview(review);
  await sendPrivate(message.chat.id, "✅ Відповідь Kondor опублікована під відгуком.");
  // Keep the expiring session for retry recovery. A new /start replaces it;
  // its old revision prevents another message from overwriting the reply.
}

export async function POST(request: NextRequest) {
  const expected = Buffer.from(process.env.TELEGRAM_WEBHOOK_SECRET || "");
  const supplied = Buffer.from(request.headers.get("x-telegram-bot-api-secret-token") || "");
  if (!expected.length || expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let update;
  try { update = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!update || !Number.isSafeInteger(update.update_id)) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }
  try {
    if (update.callback_query) await handleCallback(update.callback_query);
    else if (update.message) await handleMessage(update.message, update.update_id);
    return NextResponse.json({ ok: true });
  } catch {
    console.error("[reviews] Telegram update failed", { updateId: update.update_id });
    if (update.callback_query?.id) await answer(update.callback_query.id, "Тимчасова помилка. Спробуйте ще раз.");
    return NextResponse.json({ error: "Temporary failure" }, { status: 500 });
  }
}
