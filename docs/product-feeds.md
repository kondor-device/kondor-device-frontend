# Товарні фіди (Meta Catalog / Rozetka)

## Meta / Facebook Catalog

### URL фіда

```
https://www.kondor.ua/api/feed/meta
```

(локально під час розробки: `http://localhost:3000/api/feed/meta`)

- Формат: RSS 2.0 + `xmlns:g="http://base.google.com/ns/1.0"` (офіційний формат Meta Commerce Platform).
- Один `<item>` на кожен **колірний варіант** товару; варіанти одного товару об'єднані через `g:item_group_id` (= Sanity `_id` товару).
- `Content-Type: application/xml; charset=utf-8`.
- Джерело даних — Sanity (`GET_FEED_PRODUCTS_QUERY` в `src/lib/queries.ts`), товари з `showonmain == true` (банери категорій на головній) з фіда виключені.

### Мапінг полів

| Поле фіда | Джерело / логіка |
|---|---|
| `g:item_group_id` | `_id` товару в Sanity |
| `g:id` | `{_id_товару}-{код_кольору}` (складений — сирий SKU кольору не унікальний глобально по каталогу) |
| `g:title` | `generalname + name` (+ `, колір: ...`, якщо у товару кілька варіантів) |
| `g:description` | поле `description`, з очищенням від авторської markdown-розмітки (`* `, `**bold**`) |
| `g:link` | `https://www.kondor.ua/catalog/{slug}?color={колір}` |
| `g:image_link` / `additional_image_link` | фото кольорового варіанта (Sanity CDN) |
| `color`, `product_type` | колір варіанта, назва категорії |
| `g:brand` | `"Kondor"` (константа) |
| `g:condition` | `"new"` (константа) |
| `g:availability` | `outOfStock` → `out of stock`; `preorder` → `preorder`; інакше → `in stock` |
| `g:price` / `g:sale_price` | `price` / `priceDiscount`, формат `1199.00 UAH` |

Варіанти без жодного завантаженого фото пропускаються (Meta все одно відхилить offer без картинки).

### Кешування й оновлення

- Відповідь кешується (`export const dynamic = "force-static"` + `revalidate = 3600` в `src/app/api/feed/meta/route.ts`) — фід перегенеровується не частіше ніж раз на годину.
- Дострокове оновлення одразу після зміни товару в Sanity Studio — через вебхук `POST /api/revalidate`, підписаний HMAC-секретом (`SANITY_REVALIDATE_SECRET`). Деталі та інструкція з налаштування вебхука в Sanity — у коментарі на початку `src/app/api/revalidate/route.ts`.

### Налаштування в Meta Commerce Manager (виконати вручну, потрібен доступ до Business Manager)

1. **Commerce Manager → Каталоги → [ваш каталог] → Джерела товарів (Data sources) → Зафіксований фід даних (Scheduled feed)**.
2. Вставити URL: `https://www.kondor.ua/api/feed/meta`.
3. Частота оновлення: **раз на добу** (Meta й так частіше не тягне).
4. Формат файлу: **XML**.
5. Зберегти та запустити перший імпорт вручну ("Upload now" / "Завантажити зараз").
6. Перевірити у вкладці **Diagnostics** каталогу — Meta покаже помилки/попередження по конкретних товарах, якщо такі будуть (наприклад, невідповідність `google_product_category`, неякісні зображення тощо — це вже змістовна валідація з їхнього боку, недоступна без реального акаунта).

> Я не маю доступу до вашого Meta Business Manager, тому фактичний імпорт і перегляд Diagnostics потрібно зробити вручну. Локально фід вже перевірений скриптом-валідатором (див. нижче) на відповідність усім обов'язковим полям специфікації Meta — 0 помилок, 0 попереджень на 51 offer.

### Локальна перевірка (без Meta-акаунта)

Фід було прогнано через власний валідатор, що перевіряє відповідність [офіційній специфікації Meta Catalog](https://developers.facebook.com/docs/commerce-platform/catalog/fields/):

- XML коректно парситься (`xml.dom.minidom` / `ElementTree`).
- `rss`/`channel` мають усі обов'язкові поля.
- Кожен `<item>`: `g:id` (унікальність, ≤100 символів), `g:title`, `g:description`, `g:link`/`g:image_link` (валідні URL), `g:availability` (`in stock`/`out of stock`/`preorder`), `g:condition` (`new`), `g:price`/`g:sale_price` (формат `ЧИСЛО ВАЛЮТА`), `g:brand`, `g:item_group_id`.
- Результат на момент останньої перевірки: **51/51 offer без помилок і попереджень**.

## Rozetka (YML)

Фід для Rozetka **ще не реалізований** — Rozetka очікує інший формат (YML / Yandex Market Language, `<yml_catalog><shop><offers>`), а не той самий XML, що й Meta. Це окремий крок (Этап 6 плану), який ще не виконано.

Коли буде реалізовано — тут з'явиться:
- URL фіда (напр. `https://www.kondor.ua/api/feed/rozetka`);
- посилання на онлайн-валідатор YML, яким його перевірено;
- опис відмінностей мапінгу полів від Meta-фіда.
