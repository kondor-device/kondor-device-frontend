// Run only in the authorized Vercel Preview build. Bot credentials stay there.
// inspect: node scripts/configure-review-webhook.mjs
// activate an already READY deployment:
// node scripts/configure-review-webhook.mjs https://<deployment>.vercel.app
const target = process.argv[2];
const api = (process.env.TELEGRAM_URL_API || "").replace(/\/sendMessage\/?$/, "");
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
async function call(method, payload = {}) {
  const res = await fetch(`${api}/${method}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(15000),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`Telegram ${method} failed (${json.error_code})`);
  return json.result;
}
try {
  if (!api || !secret) throw new Error("Missing Telegram configuration");
  const before = await call("getWebhookInfo");
  console.log("[review-webhook]", JSON.stringify({ url: before.url, pending: before.pending_update_count, error: before.last_error_message, allowed: before.allowed_updates }));
  const bot = await call("getMe");
  const member = await call("getChatMember", { chat_id: process.env.TELEGRAM_CHAT_ID, user_id: bot.id });
  console.log("[review-bot]", JSON.stringify({ username: bot.username, channelRole: member.status }));
  if (!target) process.exit(0);
  if (process.env.VERCEL_ENV !== "preview" || process.env.VERCEL_GIT_COMMIT_REF !== "codex/review-moderation-replies") {
    throw new Error("Activation is restricted to the review preview branch");
  }
  const url = new URL(target);
  if (url.protocol !== "https:" || !/^kondor-device-frontend-[a-z0-9-]+-kondor-devices-projects\.vercel\.app$/.test(url.hostname) || url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
    throw new Error("Unexpected preview destination");
  }
  url.pathname = "/api/telegram/webhook";
  if (before.url && before.url !== url.href) {
    throw new Error("Existing webhook differs; inspect before changing it");
  }
  // Check both auth paths without creating reviews or sending messages.
  for (const authenticated of [false, true]) {
    const response = await fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json", ...(authenticated ? { "x-telegram-bot-api-secret-token": secret } : {}) },
      body: JSON.stringify({ update_id: -1 }), redirect: "manual", signal: AbortSignal.timeout(15000),
    });
    if (response.status !== (authenticated ? 200 : 401)) throw new Error(`Webhook health check failed: ${response.status}`);
  }
  if (member.status !== "administrator" && member.status !== "creator") throw new Error("Bot must be channel administrator");
  const allowed_updates = [...new Set([...(before.allowed_updates || []), "callback_query", "message"])];
  await call("setWebhook", { url: url.href, secret_token: secret, allowed_updates, drop_pending_updates: false });
  const after = await call("getWebhookInfo");
  if (after.url !== url.href || !after.allowed_updates?.includes("message") || !after.allowed_updates?.includes("callback_query")) throw new Error("Webhook verification failed");
  console.log("[review-webhook-active]", JSON.stringify({ url: after.url, allowed: after.allowed_updates, pending: after.pending_update_count, authChecks: "passed" }));
} catch (error) {
  // Never print fetch error objects (their URL contains the bot token).
  console.error(error instanceof Error && !error.message.includes("http") ? error.message : "Webhook setup failed");
  process.exit(1);
}
