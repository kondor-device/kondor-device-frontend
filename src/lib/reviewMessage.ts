import { escapeHtml } from "./telegram";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ReviewMessageData {
  id: string;
  author: string;
  phone?: string;
  rating: number;
  text: string;
  itemName: string;
  productUrl?: string;
}

const STATUS_LINES: Record<Exclude<ReviewStatus, "pending">, string> = {
  approved: "✅ Схвалено",
  rejected: "❌ Відхилено",
};

export const CALLBACK_PREFIX = "rv";

// callback_data ≤ 64 байти: "rv:a:" + uuid (36) — вкладається
export const buildCallbackData = (action: "a" | "r", id: string) =>
  `${CALLBACK_PREFIX}:${action}:${id}`;

export function parseCallbackData(
  data?: string
): { action: "approve" | "reject"; id: string } | null {
  const match = data?.match(/^rv:(a|r):(.+)$/);

  if (!match) return null;

  return { action: match[1] === "a" ? "approve" : "reject", id: match[2] };
}

export function buildReviewMessage(
  review: ReviewMessageData,
  status: ReviewStatus,
  moderatedBy?: string
) {
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  const product = review.productUrl
    ? `<a href="${escapeHtml(review.productUrl)}">${escapeHtml(review.itemName)}</a>`
    : escapeHtml(review.itemName);

  const lines = [
    status === "pending"
      ? "<b>⭐ Новий відгук на модерацію</b>"
      : `<b>⭐ Відгук</b> — ${STATUS_LINES[status]}${
          moderatedBy ? ` (${escapeHtml(moderatedBy)})` : ""
        }`,
    `<b>Товар:</b> ${product}`,
    `<b>Ім'я:</b> ${escapeHtml(review.author)}`,
    review.phone ? `<b>Телефон:</b> ${escapeHtml(review.phone)}` : "",
    `<b>Оцінка:</b> ${stars} (${review.rating}/5)`,
    `<b>Текст:</b> ${escapeHtml(review.text)}`,
  ].filter(Boolean);

  return {
    text: lines.join("\n"),
    reply_markup: {
      inline_keyboard:
        status === "pending"
          ? [
              [
                {
                  text: "✅ Схвалити",
                  callback_data: buildCallbackData("a", review.id),
                },
                {
                  text: "❌ Відхилити",
                  callback_data: buildCallbackData("r", review.id),
                },
              ],
            ]
          : [],
    },
  };
}
