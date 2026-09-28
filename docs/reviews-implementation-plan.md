# План: відгуки на товари з модерацією в Telegram

Гілка: `feature/product-reviews`. Зачіпає **два репозиторії**: `kondor-device-frontend` (цей) і `kondor-device-admin` (Sanity Studio) — у адмінці потрібна окрема гілка/PR.

Референс UI/логіки: `glimmer-front` (`WriteReviewForm`, `RatingField`, `Reviews`, `ProductDetails`, `getAverageRating`, `sortProducts`). Відмінність: у Glimmer відгуки вносились вручну в масив `reviews[]` товару в адмінці; тут вони приходять від відвідувачів, зберігаються в Sanity і схвалюються кнопками в Telegram.

## Потік

```
Форма (модалка на сторінці товару)
  → POST /api/reviews  (валідація, антиспам)
      → створює документ `review` у Sanity зі status=pending   (write-токен, тільки на сервері)
      → шле в Telegram-канал повідомлення з кнопками [✅ Схвалити] [❌ Відхилити]
Модератор тисне кнопку
  → Telegram → POST /api/telegram/webhook  (перевірка secret_token + хто натиснув)
      → patch review.status = approved | rejected  (тільки з pending)
      → editMessageText: прибирає кнопки, дописує «Схвалено/Відхилено — @user, час»
      → revalidatePath сторінки товару та каталогу
Сайт: показує лише approved; середній рейтинг і кількість рахуються з approved
```

## Ключові рішення

1. **Окремий тип документа `review`**, а не масив у `item` (як у Glimmer). Причини: анонімні записи з API без гонок із редагуванням товару в Studio, статуси, фільтри модерації, аудит.
2. **Рейтинг рахуємо в GROQ**, а не дублюємо в `item`: одне джерело правди, немає розсинхрону при ручній зміні статусу в Studio.
   `"ratingCount": count(*[_type=="review" && item._ref==^._id && status=="approved"])`, `"ratingAvg": math::avg(...rating)`.
   Запасний варіант, якщо запит стане важким: денормалізовані `ratingAvg/ratingCount` на `item`, які перераховує webhook.
3. **Sanity — джерело істини для статусу; Telegram — лише інтерфейс**. Статус можна змінити і в Studio (запасний шлях, якщо бот недоступний).
4. **Не використовувати наявний `/api/telegram`** — він публічний, приймає будь-який текст і шле в канал (відкритий релей). Для відгуків — окремі маршрути; за бажання окремо закрити й старий.
5. Свій компонент зірок (без `react-simple-star-rating`, який є в Glimmer, але не в цьому проєкті) — `radiogroup` з клавіатурою й `aria-label`, стилі за токенами Kondor (обидві теми).

## Етап 1. Sanity Studio (`kondor-device-admin`)

1. `schemaTypes/review.ts` — документ `review`:
   - `item` (reference → `item`, required)
   - `author` (string, 2–30), `phone` (string, формат `+38 (0XX) XXX-XX-XX`, **не віддається на фронт**), `rating` (number 1–5, integer), `text` (text, 2–500)
   - `status` (`pending` | `approved` | `rejected`, default `pending`, radio)
   - `submittedAt` (datetime, readOnly), `moderatedAt` (datetime), `moderatedBy` (string — Telegram username/id)
   - `telegramMessageId` (number, readOnly), `locale` (`uk`|`ru`, readOnly)
   - preview: `author · ★rating · status`, subtitle — назва товару
2. Додати в `schemaTypes/index.ts`.
3. `structure.ts`: група «⭐ Відгуки» → «На модерації» / «Схвалені» / «Відхилені» (`documentList` з фільтром по `status`), додати `review` у `HIDDEN_TYPES`.
4. Деплой Studio; створити в manage.sanity.io **API token з правом Editor** (`SANITY_WRITE_TOKEN`).

## Етап 2. Backend у фронті (Next route handlers)

Нові env (додати в `env.example`, `.env.local`, Vercel): `SANITY_WRITE_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`. Канал той самий, що й для замовлень (`TELEGRAM_CHAT_ID`); список модераторів не потрібен.

5. `src/lib/sanityWriteClient.ts` — `createClient({ token, useCdn: false })`, лише server-only.
6. `src/schemas/reviewValidation.ts` — спільна yup-схема (форма + сервер): name 2–30, phone (як у checkout), rating 1–5 int, message 2–500.
7. `POST /api/reviews`:
   - валідація тілом (yup), перевірка що `itemId` існує;
   - антиспам без нової інфраструктури: honeypot-поле, мінімальний час заповнення форми, а ліміти рахуємо запитом до Sanity (in-memory на serverless не працює): той самий телефон+товар → 409, понад 3 відгуки з одного телефону за 24 год → 429. Якщо колись знадобиться ліміт по IP — безкоштовний tier Upstash;
   - `create` документа `review` зі `status: "pending"`;
   - `sendMessage` у Telegram: `parse_mode: HTML`, **весь користувацький текст екранувати** (`& < >`), inline-клавіатура `callback_data: "rv:a:<_id>"` / `"rv:r:<_id>"` (≤64 байти — `_id` це uuid, вкладається);
   - зберегти `telegramMessageId` у документ; якщо Telegram упав — відповісти успіхом користувачу (відгук уже в Sanity зі `pending`), залогувати помилку; ретрай/нагадування — необовʼязково.
8. `POST /api/telegram/webhook`:
   - перевірити заголовок `X-Telegram-Bot-Api-Secret-Token === TELEGRAM_WEBHOOK_SECRET`, інакше 401;
   - обробляти лише `callback_query` з префіксом `rv:` і лише якщо `callback_query.message.chat.id === TELEGRAM_CHAT_ID` (без прив'язки до конкретних модераторів — хто має доступ до закритого каналу, той і модерує); `from` (id/username) пишемо в `moderatedBy` для аудиту;
   - **ідемпотентність**: `patch(id).ifRevisionId(...)` або умовний patch лише якщо `status == "pending"` — повторний клік/два модератори не перезаписують рішення;
   - виставити `status`, `moderatedAt`, `moderatedBy`;
   - `answerCallbackQuery` + `editMessageText`/`editMessageReplyMarkup` — прибрати кнопки, показати рішення й хто ухвалив;
   - при `approved` → `revalidatePath` для `/catalog`, `/catalog/[category]/[product]` (обидві локалі, як у `revalidate/route.ts`: `getLocalizedPaths`); винести спільні хелпери з `revalidate/route.ts` в `src/lib/revalidate.ts`.
   - завжди відповідати 200 на валідні апдейти (щоб Telegram не ретраїв).
9. `scripts/set-telegram-webhook.mjs` — одноразово викликає `setWebhook` (`url`, `secret_token`, `allowed_updates: ["callback_query"]`); документувати в README. Бот має бути адміном каналу.
10. Розширити `api/revalidate/route.ts` (Sanity-вебхук): додати `review` у фільтр; для `review` витягувати slug/категорію товару через `item->` і ревалідувати його сторінки — покриває ручну зміну статусу в Studio. Оновити коментар про фільтр вебхука.

## Етап 3. Дані та типи на фронті

11. `src/types/review.ts` — `Review { id, author, rating, text, date }`; у `ProductItem` додати `ratingAvg?: number`, `ratingCount?: number`, `reviews?: Review[]` (лише в детальному запиті).
12. `src/lib/queries.ts`:
    - спільний `RATING_PROJECTION` → `ratingAvg`, `ratingCount` (approved) — у `CATEGORY_PROJECTION.items`, `MAIN_PRODUCTS_PROJECTION`, `ITEM_DETAIL_PROJECTION`;
    - `ITEM_DETAIL_PROJECTION`: `"reviews": *[_type=="review" && item._ref==^._id && status=="approved"] | order(submittedAt desc)[0...50]{ "id": _id, author, rating, text, "date": submittedAt }` (phone не проєктуємо).
13. `utils/getAverageRating.ts` не потрібен (рахує GROQ); округлення до 0.1 на клієнті через `formatRating`.

## Етап 4. UI на сторінці товару

14. `components/shared/forms/formComponents/RatingField.tsx` — зірки (Formik `useField("rating")`), hover/focus, `aria-*`.
15. `components/productPage/productInfo/WriteReviewForm.tsx` — Formik + yup (за зразком `WriteReviewForm` Glimmer): ім'я, телефон, зірки, текст, приховане honeypot-поле; submit → `POST /api/reviews`; стани loading/успіх/помилка. Відкривати через існуючий `useModalStore.openModal` (у Kondor модалка глобальна, не локальний стейт) + `NotificationPopUp` із текстом «Дякуємо! Після модерації відгук з'явиться на сторінці».
16. `components/productPage/productInfo/Reviews.tsx` — список (перші 2 + «Показати більше», як у Glimmer), порожній стан, кнопка «Написати відгук», дата через `Intl.DateTimeFormat(locale)`.
17. Рейтинг біля назви товару в `ProductInfo` (зірки + `4.7 (12 відгуків)`, плюралізація uk/ru через ICU у next-intl); клік — скрол до секції відгуків.
18. Додати таб «Відгуки» в `Navigation.tsx` (id секції, spy-логіка вже є).
19. `components/shared/StarRating.tsx` (readonly, дробові зірки) — використовується на сторінці товару та в картках каталогу.
20. JSON-LD: якщо на сторінці товару додається `Product` — включити `aggregateRating` (лише коли `ratingCount > 0`) і `review[]`. Використати наявний `JsonLd`.

## Етап 5. Каталог

21. `CatalogCard` / `homePage/catalog/productCard`: компактний рейтинг (зірка + число + кількість), лише якщо є відгуки.
22. `CatalogSorting.tsx`: опція `rating` («за рейтингом»).
23. `CatalogSlider.tsx` (`getFilteredAndSortedItems`): `case "rating"` — за `ratingAvg` desc, тай-брейк `ratingCount` desc; товари без відгуків — в кінець (не як 0★ вище за 3★). Фільтри/сортування вже клієнтські — додаткових запитів немає.

## Етап 6. i18n

24. `messages/uk.json` та `ru.json`: `reviews.*` (заголовки, поля, плейсхолдери, помилки валідації, успіх/помилка, плюралізація «відгук/відгуки/відгуків»), `catalogPage.sortingOptions.rating`. У Telegram-повідомленні лишається українська (внутрішній інструмент).

## Етап 7. Безпека та якість

- Токени тільки на сервері; `phone` ніколи не потрапляє у GROQ для фронту й не показується публічно.
- Екранування HTML у Telegram; ліміти довжини на сервері; відкидати відгуки для неіснуючого `itemId`.
- Секрет вебхука + перевірка chat id каналу; ідемпотентні переходи статусів; `moderatedBy` для аудиту.
- Тест-скрипт `scripts/test-review-flow.mjs` (за зразком `test-order-flow.mjs`): створення → імітація callback → перевірка статусу.
- Ручний прогін: submit → повідомлення в каналі → «Схвалити» → відгук і середня оцінка на товарі (після ревалідації), сортування за рейтингом; «Відхилити» → не видно; повторний клік не міняє рішення; тема light/dark, uk/ru, мобільний/десктоп.
- `npm run lint`, `npm run build`.

## Порядок робіт / PR

1. Admin: схема + структура + токен → деплой Studio.
2. Front: типи, запити, рейтинг (read-only частина) → можна вже заповнити тестові відгуки вручну в Studio.
3. Front: форма + `/api/reviews` + Telegram-повідомлення.
4. Front: webhook + модерація + ревалідація + `setWebhook`.
5. Каталог: сортування й картки. 6. i18n, JSON-LD, тести, полірування.

## Ухвалені рішення

- Той самий Telegram-канал, що й для замовлень; модератори не прив'язані (доступ = членство в закритому каналі, хто ухвалив — пишеться в `moderatedBy`).
- Відгуки показуємо всіма мовами, без перекладу.
- Rate limit — через запити до Sanity + honeypot, без нових сервісів.

## Відкрите

- Відповідь магазину на відгук (поле `reply`) — поза цим обсягом.
