# Review moderation preview

This branch extends `feature/product-reviews`. Production is not merged or promoted.

The bot's webhook was empty when inspected on 2026-10-25. Sending review notifications
does not configure incoming callbacks. Use `scripts/configure-review-webhook.mjs`
inside Vercel to inspect the connection and explicitly activate a READY preview URL.
It checks the webhook with and without its secret, checks the bot's channel role,
preserves queued updates, and refuses to overwrite a different existing webhook.
Keep bot credentials in Vercel. The normal build does not reconfigure Telegram.

## Moderator workflow

1. A channel administrator approves or rejects the existing notification.
2. An approved notification gains a **Відповісти** button.
3. The button opens the bot in a private chat. Tap **Start** if Telegram asks.
4. Reply to the bot's prompt with 2–1000 characters. The answer is published as
   **Відповідь Kondor** under the review on the preview site.
5. **Змінити відповідь** starts a new prompt for replacing the answer; `/cancel`
   abandons the current prompt. Prompts expire after one hour.

Only the configured channel's owner/administrators can moderate or reply.
Sanity stores `review.reply` with text, publication time, moderator and Telegram update ID.
The website projects only the reply text/date. `reviewReplySession.<user-id>` stores
one expiring prompt per moderator (no message text), reused for retry recovery.
Concurrent/stale prompts cannot silently overwrite newer replies. Telegram retries
transient failures; repeated moderation does not reverse a completed decision.

The bot has one webhook for all previews. Keep the activated deployment available;
do not remove it before intentionally moving the webhook. The shared production
Sanity dataset and bot are used with the owner's authorization. Test reviews are
real database records. No CRM/payment configuration is changed by this branch.

## Validation

`node --test scripts/test-review-webhook.cjs` runs offline tests for authorization,
approval/rejection, duplicate delivery, concurrent changes, failed writes, reply
publication, reply editing/expiration, and escaped UI rendering. No external messages
or database mutations are made by these tests.

`npx tsc --noEmit` and `npm run build` check the application. For a live connection
check the configuration script sends only an authenticated no-op Telegram update;
it does not fabricate an administrator action or publish a customer's review.
