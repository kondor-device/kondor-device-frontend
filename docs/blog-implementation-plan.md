# План реалізації блогу (v2)

**Зразки:** frontend `happy-bar-grill-frontend`, адмінка `happy-bar-grill-admin` (Sanity). Проєкти `nbyg*` не використовуються.
**Стилізація:** у стилі Kondor (токени `bg-surface`, `shadow-card`, `Section`, `SectionTitle`, `text-*bold/med`, брейкпоінти `tabxl`/`laptop`, світла/темна тема, `next-intl`), а не палітра зразка.

## Структура сторінок (зі зразка)
- **`/blog`** — hero (заголовок + підзаголовок) → breadcrumbs → **сітка карток** (1/2/3 колонки) → **пагінація** (у зразку її немає — додаємо за вимогою) → порожній стан.
- **`/blog/[slug]`** — hero (фон desktop/mobile, градієнт, заголовок, опис, автор + дата) → breadcrumbs → **контент (rich text)** + **FAQ** → **рекомендовані статті** (sidebar на десктопі, слайдер на мобільному).
- **Rich text** (`articlePortableText`): h2/h3/h4, normal, bullet/number, strong/em, link (`href` + `blank`), image (alt), table, gallerySection, кнопка `faqAnswerButton` (CTA-блок).
- **FAQ:** масив `customFaq` (питання + відповідь у Portable Text: normal, bullet, strong/em, link, кнопка), акордеон.
- **SEO:** `seoSettings` у статті + синглтон `blogPage`, JSON-LD `BlogPosting`, `schemaJson`, sitemap.
- **Автор:** окремий документ `blogAuthor` (імʼя, фото, посилання) — reference у статті.

## Що відрізняється в Kondor (адаптація)
| Тема | Зразок | Kondor → рішення |
|---|---|---|
| Локалізація в Sanity | обʼєкти `{uk, ru}` (`localeString`, `localeArticlePortableText`) | суфікс `Ru` (`defineRuField`, `l10n()`). Тримаємо конвенцію Kondor: `heroTitle`/`heroTitleRu`, `content`/`contentRu` тощо. Фолбек ru→uk, якщо `…Ru` порожнє |
| Отримання даних | `sanityFetch` (next-sanity) | `getProducts()` → `fetchSanityData` → `/api/sanity` (додає `$locale`) |
| Next / next-intl | 16 / 4 | 15.1 / 3.26 — синтаксис `params`/`searchParams` як у наявних сторінках `[locale]` |
| Rich text | `@portabletext/react` | додати залежність |
| Breadcrumbs, Pagination, Swiper-обгортка | є | у Kondor немає breadcrumbs і пагінації; `swiper` є, обгортку слайдера робимо за прикладом `CatalogSlider` |
| Дата | `_createdAt` | явне `publishedAt` (можна редагувати, сортування) |

## Кроки

### Етап 1. Адмінка (`kondor-device-admin`, гілка `blog`)
1. `npm i @sanity/table`; `table()` у `plugins` в `sanity.config.ts`.
2. `schemaTypes/lib/…` — перевикористати `defineRuField` (`ruField.ts`); для Portable Text додати `articlePortableTextOf` (єдине джерело блоків: h2–h4, bullet/number, strong/em, link, image, table, gallerySection, faqAnswerButton).
3. `schemaTypes/faqAnswerButton.ts` (label, href, newTab), `gallerySection.ts`, `faqQuestion.ts` (`question`+`questionRu`, `answer`+`answerRu` — обмежений Portable Text з кнопкою), `seoSettings.ts` (uk + `…Ru`, opengraphImage, schemaJson-файл).
4. `schemaTypes/blogAuthor.ts` (name+nameRu, photo+alt, profileUrl).
5. `schemaTypes/blogPost.ts`: `heroTitle(+Ru)`, `heroDescription(+Ru)`, `heroDesktopImage`/`heroMobileImage` (hotspot, alt+altRu), `slug` (від `heroTitle`, `isUnique`), `publishedAt`, `author` (ref), `content` + `contentRu`, `customFaq`, `seo`. Валідація «Ru обовʼязкове, якщо заповнене uk» (як `defineRuField`; для масивів — власний custom-валідатор).
6. `schemaTypes/blogPage.ts` — синглтон із `seo`; `schemaTypes/index.ts`; `structure.ts` (як у зразку): група «📰 Блог» — Статті (за `publishedAt desc`), Автори, сторінка «Блог».
7. Перевірка в Studio; створити 2–3 тестові статті, що покривають усі типи блоків + FAQ з кнопкою.

### Етап 2. Фронтенд — інфраструктура (`kondor-device-frontend`, гілка `blog`)
8. `npm i @portabletext/react`; переконатися, що `cdn.sanity.io` є в `images.remotePatterns` (є).
9. `src/types/blog.ts` — `BlogPostPreview`, `BlogPost`, `BlogFaqItem`, `BlogAuthor`, `BlogPostSeo` (по зразку `types/blog.ts`).
10. `src/lib/queries.ts` (через `l10n()` з фолбеком): `ALL_BLOG_POSTS_QUERY` (з пагінацією `[$from...$to]` + окремий `BLOG_POSTS_COUNT_QUERY`), `BLOG_POST_BY_SLUG_QUERY` (hero, `content`/`contentRu`, `customFaq`, author, seo), `OTHER_BLOG_POSTS_QUERY` (без поточної, 3 шт., за `publishedAt desc`), `BLOG_POST_SLUGS_QUERY`, `BLOG_PAGE_SEO_QUERY`, `SITEMAP_BLOG_POSTS_QUERY`.
11. `src/data/blog.ts` — accessors `getBlogPosts(locale, page)`, `getBlogPostBySlug`, `getOtherBlogPosts`, `getBlogPostSlugs` (`cache()`).
12. `src/utils/formatBlogDate.ts` (uk/ru), `src/lib/sanityImage.ts` (`urlFor`).
13. Переклади `messages/uk.json`/`ru.json`: `BlogPage` (heroTitle, heroSubtitle, readMore, empty, faqTitle, otherPostsTitle), breadcrumbs, `header.navMenu.blog`, footer.

### Етап 3. Сторінка `/blog`
14. `src/app/[locale]/blog/page.tsx`: `generateMetadata` (SEO з `blogPage` + `getPageAlternates`, canonical з урахуванням `?page`), `searchParams.page`, невалідна/завелика сторінка → перша/`notFound`.
15. `components/blogPage/Hero.tsx` — заголовок/підзаголовок у стилі Kondor (`pt-[60px] tabxl:pt-[113px]`, `Section`).
16. `shared/breadcrumbs/Breadcrumbs.tsx` (Головна → Блог, локалізовані посилання) + JSON-LD `BreadcrumbList`.
17. `components/blogPage/BlogCard.tsx` — зображення 16/10, дата, заголовок (`line-clamp-2`), опис (`line-clamp-3`), «Читати далі →», hover; стиль як картки каталогу (`bg-surface`, `shadow-card`).
18. `components/blogPage/BlogList.tsx` — `ul` сітка 1/2/3 кол., анімація появи (framer-motion, як в інших секціях), порожній стан.
19. `shared/pagination/Pagination.tsx` — **серверна** пагінація з реальними `<Link href="?page=N">` (краулиться, працює без JS): «‹ 1 2 3 … N ›», активна сторінка, disabled стрілки, `rel=prev/next`; 9 карток/сторінку (3×3) на всіх екранах — щоб не залежати від ширини й уникнути гідрації. Стиль кнопок — токени Kondor, обидві теми.

### Етап 4. Сторінка `/blog/[slug]`
20. `src/app/[locale]/blog/[slug]/page.tsx`: `generateStaticParams` (усі slug × locale), `generateMetadata` (seo → fallback hero, `openGraph.type = article`, `publishedTime`, `getPageAlternates`), `notFound()`.
21. `components/articlePage/ArticleHero.tsx` — фон desktop/mobile через `next/image`, градієнт-скрим, `h1`, опис (`whitespace-pre-line`), автор (фото, імʼя) + дата.
22. `components/articlePage/portableText/portableTextComponents.tsx` — **повний паритет блоків**: `h2`, `h3`, `h4`, `normal`, `bullet`, `number`, `strong`, `em`, `link` (внутрішні через i18n `Link`, зовнішні з `blank`), `image` (розміри з asset-ref, portrait/landscape), `gallerySection`, `table` (шапка + рядки, горизонтальний скрол), `faqAnswerButton` (наш `Button`). Кольори/шрифти — токени Kondor (`text-*`, `bg-surface`, `shadow-card`), працюють у світлій/темній темі.
23. `ArticleContent.tsx` (обгортка `PortableText`), `BlogFaq.tsx` (акордеон, відповідь — Portable Text тими ж компонентами; ARIA `aria-expanded/controls`; стиль — як `homePage/faq/FaqItem`) + JSON-LD `FAQPage` (відповіді у plain text).
24. `OtherPosts.tsx` — sidebar 320px на десктопі (`lg:flex gap-10`, sticky), Swiper-слайдер на мобільному (кнопки prev/next, як у каталозі).
25. JSON-LD `BlogPosting` (headline, description, image, datePublished, dateModified, author `Person`, publisher) + `schemaJson` з `seo`.

### Етап 5. Інтеграція
26. `NavMenu.tsx` (+мобільне меню) — пункт «Блог» перед FAQ; футер (`Important`/`Details`).
27. `next-sitemap.config.js`: `/blog` у `staticPages`; статті через GROQ `*[_type=="blogPost" && defined(slug.current)]` → `/blog/{slug}` для обох мов (hreflang вже підтримано).
28. `api/revalidate/route.ts`: обробка `_type == "blogPost" | "blogPage" | "blogAuthor"` → `revalidatePath` для `/blog`, `/blog/{slug}` у двох локалях; оновити фільтр вебхука в Sanity.
29. Перевірити роутинг `/blog*` у `middleware.ts` (i18n, `as-needed`).

### Етап 6. Перевірка та реліз
30. Ручна перевірка: uk/ru (фолбек, коли `Ru` порожнє), світла/темна тема, 375/768/1280+, пагінація (1 сторінка, багато, `?page=99`, `?page=abc`), стаття з усіма блоками, без FAQ, без автора, порожній блог.
31. `npm run lint && npm run build`; перевірка метаданих, canonical/hreflang, JSON-LD (Rich Results Test), доступність (клавіатура в акордеоні/пагінації).
32. Реліз: спершу PR адмінки + `sanity deploy`, потім PR фронтенду; налаштувати вебхук Sanity.

## Рішення, які варто підтвердити
1. **Локалізація** — лишаємо суфікс `Ru` (узгоджено з поточною адмінкою Kondor) замість обʼєктів `{uk, ru}` зі зразка. Другий варіант — переїхати на `{uk, ru}` лише для блогу, але це розходиться з рештою схем.
2. **Пагінація** — серверна (`?page=`, 9 карток/сторінку) замість клієнтської; підходить?
3. **Автор** — окремий документ, як у зразку, чи достатньо без автора?
4. **Порядок деплою** — схема в Sanity має бути задеплоєна до фронтенду.
