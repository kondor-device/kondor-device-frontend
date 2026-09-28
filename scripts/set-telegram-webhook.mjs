// Реєструє вебхук Telegram-бота для модерації відгуків (кнопки в каналі).
//
// Використання:
//   node --env-file=.env.local scripts/set-telegram-webhook.mjs https://www.kondor.ua
//
// Потрібні змінні: TELEGRAM_URL_API (URL методу sendMessage), TELEGRAM_WEBHOOK_SECRET.
// Бот має бути адміністратором каналу. Для локальної перевірки використайте
// тунель (ngrok/cloudflared) і передайте його URL.

const siteUrl = process.argv[2]?.replace(/\/$/, "");
const apiUrl = process.env.TELEGRAM_URL_API;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!siteUrl || !apiUrl || !secret) {
  console.error(
    "Потрібні: аргумент з URL сайту, TELEGRAM_URL_API і TELEGRAM_WEBHOOK_SECRET"
  );
  process.exit(1);
}

const base = apiUrl.replace(/\/sendMessage\/?$/, "");

const res = await fetch(`${base}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: `${siteUrl}/api/telegram/webhook`,
    secret_token: secret,
    allowed_updates: ["callback_query"],
  }),
});

console.log(await res.json());

const info = await fetch(`${base}/getWebhookInfo`).then((r) => r.json());
console.log(info);
