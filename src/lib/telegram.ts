import "server-only";
import axios from "axios";

// TELEGRAM_URL_API — це повний URL методу sendMessage
// (https://api.telegram.org/bot<TOKEN>/sendMessage); базу беремо з нього,
// щоб не заводити окрему змінну для токена.
const BASE_URL = (process.env.TELEGRAM_URL_API || "").replace(
  /\/sendMessage\/?$/,
  ""
);

export async function telegramCall<T = unknown>(
  method: string,
  payload: Record<string, unknown>
): Promise<T> {
  const { data } = await axios.post(`${BASE_URL}/${method}`, payload);
  return data.result as T;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// TELEGRAM_CHAT_ID може бути числовим id або "@username" каналу
export function isConfiguredChat(chat?: {
  id?: number | string;
  username?: string;
}): boolean {
  const configured = (process.env.TELEGRAM_CHAT_ID || "").trim().toLowerCase();

  if (!configured || !chat) return false;

  return (
    String(chat.id) === configured ||
    (!!chat.username && `@${chat.username}`.toLowerCase() === configured)
  );
}
