/**
 * Наскрізна перевірка флоу відгуків на запущеному dev/prod-сервері:
 *   форма → /api/reviews → Sanity (pending) → Telegram-повідомлення
 *   → імітація натискання кнопки → /api/telegram/webhook → статус у Sanity.
 *
 * Запуск (сервер має бути вже запущений, за замовчуванням NEXT_PUBLIC_BASE_URL):
 *   node scripts/test-review-flow.mjs
 *
 * Потрібні змінні в .env.local: SANITY_WRITE_TOKEN, TELEGRAM_WEBHOOK_SECRET,
 * TELEGRAM_CHAT_ID, TELEGRAM_URL_API — і ці ж значення мають бути в оточенні
 * самого сервера (перезапустіть його після зміни .env.local).
 *
 * УВАГА: у Telegram-канал піде справжнє повідомлення з новим відгуком; наприкінці
 * скрипт його "схвалює" (повідомлення оновиться) і видаляє тестовий відгук із Sanity.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const getEnv = (key) => {
  const m = env.match(new RegExp(`^${key}=(.*)$`, "m"));
  if (!m) return "";
  let v = m[1].trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  return v;
};

const BASE_URL = (getEnv("NEXT_PUBLIC_BASE_URL") || "http://localhost:3000/").replace(/\/?$/, "/");
const TOKEN = getEnv("SANITY_WRITE_TOKEN");
const SECRET = getEnv("TELEGRAM_WEBHOOK_SECRET");
const CHAT_ID = getEnv("TELEGRAM_CHAT_ID");

const missing = Object.entries({
  SANITY_WRITE_TOKEN: TOKEN,
  TELEGRAM_WEBHOOK_SECRET: SECRET,
  TELEGRAM_CHAT_ID: CHAT_ID,
})
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  console.error(`У .env.local немає: ${missing.join(", ")}`);
  process.exit(1);
}

const SANITY = "https://qmszlzqu.api.sanity.io/v2025-11-11/data";
const sanityQuery = async (query, params = {}) => {
  const qs = new URLSearchParams({ query });
  for (const [k, v] of Object.entries(params)) qs.set(`$${k}`, JSON.stringify(v));
  const res = await fetch(`${SANITY}/query/production?${qs}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: "no-store",
  });
  return (await res.json()).result;
};
const sanityDelete = (id) =>
  fetch(`${SANITY}/mutate/production`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations: [{ delete: { id } }] }),
  });

let failures = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "✅" : "❌"} ${name}${extra ? ` — ${extra}` : ""}`);
  if (!ok) failures += 1;
};

const post = (route, body, headers = {}) =>
  fetch(`${BASE_URL}${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

const callback = (data, { secret = SECRET, chatId = CHAT_ID, messageId } = {}) => {
  const isUsername = chatId.startsWith("@");
  return post(
    "api/telegram/webhook",
    {
      update_id: Date.now(),
      callback_query: {
        id: "test-callback",
        from: { id: 1, username: "review_flow_test" },
        data,
        message: {
          message_id: messageId,
          chat: isUsername
            ? { id: 0, username: chatId.slice(1) }
            : { id: Number(chatId) },
        },
      },
    },
    { "x-telegram-bot-api-secret-token": secret }
  );
};

const stamp = Date.now();
// Унікальний тестовий номер у форматі маски +38 (0XX) XXX-XX-XX
const tail = String(stamp % 10_000_000).padStart(7, "0");
const phone = `+38 (099) ${tail.slice(0, 3)}-${tail.slice(3, 5)}-${tail.slice(5, 7)}`;
let reviewId = null;

try {
  const item = await sanityQuery(
    `*[_type == "item" && showonmain != true && defined(slug)][0]{ _id, name }`
  );
  if (!item) throw new Error("Не знайшов жодного товару в Sanity");
  console.log(`Товар для тесту: ${item.name} (${item._id})\n`);

  const body = {
    itemId: item._id,
    name: "Тест Флоу",
    phone,
    rating: 5,
    message: "🧪 Тестовий відгук <b>перевірки</b> — можна ігнорувати",
    locale: "uk",
    website: "",
    startedAt: Date.now() - 10_000,
  };

  // 1. Антиспам: honeypot та "занадто швидко" — успіх без збереження
  let res = await post("api/reviews", { ...body, website: "http://spam" });
  check("honeypot: відповідь 200", res.status === 200);
  res = await post("api/reviews", { ...body, startedAt: Date.now() });
  check("надто швидка відправка: відповідь 200", res.status === 200);
  const spamSaved = await sanityQuery(
    `count(*[_type == "review" && phone == $phone])`,
    { phone }
  );
  check("антиспам нічого не зберіг", spamSaved === 0, `у Sanity: ${spamSaved}`);

  // 2. Валідація
  res = await post("api/reviews", { ...body, rating: 9 });
  check("некоректна оцінка → 400", res.status === 400, `статус ${res.status}`);

  // 3. Створення відгуку
  res = await post("api/reviews", body);
  check("створення відгуку → 200", res.status === 200, `статус ${res.status}`);

  const review = await sanityQuery(
    `*[_type == "review" && phone == $phone][0]{ _id, status, rating, telegramMessageId }`,
    { phone }
  );
  reviewId = review?._id ?? null;
  check("відгук у Sanity зі статусом pending", review?.status === "pending");
  check(
    "збережено telegramMessageId (повідомлення в каналі)",
    !!review?.telegramMessageId,
    "якщо ❌ — перевірте TELEGRAM_URL_API і що бот адмін каналу"
  );

  // 4. Дублікат
  res = await post("api/reviews", body);
  check("дублікат (той самий телефон+товар) → 409", res.status === 409, `статус ${res.status}`);

  if (reviewId) {
    const data = (action) => `rv:${action}:${reviewId}`;
    const messageId = review.telegramMessageId ?? 1;
    const status = () =>
      sanityQuery(`*[_id == $id][0].status`, { id: reviewId });

    // 5. Безпека вебхука
    res = await callback(data("a"), { secret: "wrong", messageId });
    check("неправильний secret → 401", res.status === 401, `статус ${res.status}`);

    res = await callback(data("a"), { chatId: "-1", messageId });
    check("сторонній чат ігнорується", (await status()) === "pending");

    // 6. Схвалення і ідемпотентність
    res = await callback(data("a"), { messageId });
    check("схвалення: 200", res.status === 200);
    check("статус → approved", (await status()) === "approved");

    const moderated = await sanityQuery(
      `*[_id == $id][0]{ moderatedBy, moderatedAt }`,
      { id: reviewId }
    );
    check("записано moderatedBy/moderatedAt", !!moderated?.moderatedBy && !!moderated?.moderatedAt);

    await callback(data("r"), { messageId });
    check("повторне рішення не перезаписує (лишається approved)", (await status()) === "approved");

    // 7. Відгук видно у публічних даних
    const publicCount = await sanityQuery(
      `count(*[_type == "review" && _id == $id && status == "approved"])`,
      { id: reviewId }
    );
    check("схвалений відгук потрапляє в вибірку для сайту", publicCount === 1);
  }
} catch (error) {
  console.error("Помилка тесту:", error);
  failures += 1;
} finally {
  if (reviewId) {
    await sanityDelete(reviewId);
    console.log(`\nТестовий відгук ${reviewId} видалено з Sanity`);
  }
}

console.log(failures ? `\n❌ Провалено перевірок: ${failures}` : "\n✅ Усі перевірки пройдені");
process.exit(failures ? 1 : 0);
