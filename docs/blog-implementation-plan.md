# План реалізації блогу

Зразки: frontend `nbygkobenhavn-front`, адмінка `nbyg-adm` (Sanity). Стилізація — за поточним проєктом (токени `bg-surface`, `shadow-card`, `Section`, `SectionTitle`, `text-*bold/med`, брейкпоінти `tabxl`/`laptop`, світла/темна тема).

## Що беремо зі зразка
| Зразок | Що переносимо |
|---|---|
| `blogPost` (adm) | hero (title, description, desktop/mobile image), slug, `content` (rich text: h2/h3/h4, bullet/number, strong/em, link, image, table), `faq`, `seo` |
| `blogPage` (adm) | синглтон зі SEO сторінки списку |
| `app/blog/page.tsx` | hero → breadcrumbs → сітка карток з пагінацією |
| `app/blog/[article]/page.tsx` | hero → breadcrumbs → контент + FAQ → рекомендовані статті (sidebar на десктопі, слайдер на мобільному) |
| `Pagination`, `useBlogArticlesPerPage` | пагінація через `?page=`, 12/6 карток на сторінку |
| `blogPortableTextComponents` | рендер rich text (усі типи блоків) |
| `ArticleSchema` | JSON-LD `Article` |

## Адаптація під Kondor
- **Мови:** uk/ru через `next-intl`; у Sanity — поля з суфіксом `Ru` (`defineRuField`), у GROQ — `l10n()`. Slug спільний для обох мов.
- **Немає** `motion`, `@portabletext/react`, breadcrumbs, SanityImage — додаємо/замінюємо на `framer-motion`, `next/image` + `@sanity/image-url` (вже є).
- Дані — через `getProducts`/`fetchSanityData` (`/api/sanity`), не напряму.
- Проєкт-зразок не має `gallerySection` у блозі — пропускаємо (не в адмінці зразка).

## Кроки

### Етап 1. Адмінка (`kondor-device-admin`, окрема гілка `blog`)
1. `npm i @sanity/table`, додати `table()` у `plugins` в `sanity.config.ts`.
2. `schemaTypes/blogPost.ts`: 
   - `heroTitle` + `heroTitleRu`, `heroDescription` + `heroDescriptionRu` (`defineRuField`);
   - `heroDesktopImage`, `heroMobileImage` (hotspot, alt + `altRu`);
   - `slug` (від `heroTitle`, з транслітерацією кирилиці → латиниця, `isUnique`);
   - `publishedAt` (datetime, за замовчуванням now) — для сортування;
   - `content` (uk) і `contentRu` — масив: block (h2/h3/h4, bullet/number, strong/em, link `href`+`blank`), image (alt), table;
   - `faq` (об'єкт `faqSection`: `description`, `items[question, answer]` + Ru-версії, без `buttons` — у Kondor їх немає);
   - `seo` (`metaTitle`, `metaDescription`, `opengraphImage` + Ru).
3. `schemaTypes/blogPage.ts` — синглтон (`seo` + Ru), `schemaTypes/faqSection.ts`, `seoSettings.ts`.
4. Зареєструвати типи в `schemaTypes/index.ts`; у `sanity.config.ts` — структура: список статей (сортування за `publishedAt desc`) + синглтон «Блог».
5. `sanity deploy`/перевірка в Studio, створити 1–2 тестові статті з усіма типами блоків (щоб перевірити рендер).

### Етап 2. Фронтенд — інфраструктура (гілка `blog`)
6. `npm i @portabletext/react`. Типи `src/types/blogPost.ts` (`BlogPost`, `BlogPostPreview`, content-блоки, FAQ, SEO).
7. `src/lib/sanityImage.ts` (`urlFor` на базі `@sanity/image-url` + `client`).
8. GROQ у `src/lib/queries.ts`: `ALL_BLOG_POSTS_QUERY` (превʼю: title, description, mobile image, slug, publishedAt; order by `publishedAt desc`), `BLOG_POST_BY_SLUG_QUERY` (повний, з `asset->metadata.dimensions` для зображень і таблиць), `BLOG_PAGE_QUERY` (SEO), `BLOG_SLUGS_QUERY`. Усе через `l10n()` з фолбеком на uk.
9. Переклади `messages/uk.json`, `ru.json`: `blog.title`, `blog.readMore`, `blog.recommended`, `blog.faqTitle`, `breadcrumbs.*`, `header.navMenu.blog`, `footer`.

### Етап 3. Сторінка списку `/blog`
10. `src/app/[locale]/blog/page.tsx`: `generateMetadata` (SEO з `blogPage` або дефолт + `getPageAlternates(locale,"/blog")`), server fetch усіх превʼю.
11. `components/blogPage/hero/Hero.tsx` — заголовок сторінки в стилі поточних сторінок (`PageTitle`/`Section`, відступ `pt-[60px] tabxl:pt-[113px]`).
12. `components/blogPage/blogList/BlogCard.tsx` — картка: зображення (aspect 16/10), заголовок, опис (`line-clamp`), дата, «Читати далі →`; стиль як `CatalogCard` (`bg-surface`, `shadow-card`, hover), `Link` з `@/i18n/routing`.
13. `components/shared/pagination/Pagination.tsx` — перенос логіки зі зразка (`?page=`, скрол до початку списку, скорочення «...»), кнопки/кола в стилі проєкту, обидві теми. Врахувати `useSearchParams` → обгорнути у `Suspense`.
14. `hooks/useBlogArticlesPerPage.ts` (12 ≥640px / 6 нижче; за аналогією з `useCatalogItemsPerPage`) і `BlogList.tsx` (сітка 1/2/3 колонки, `ul`, анімація появи).
15. Порожній стан (немає статей), валідація `?page` за межами діапазону.

### Етап 4. Сторінка статті `/blog/[article]`
16. `src/app/[locale]/blog/[article]/page.tsx`: `generateMetadata` (title/description/OG-image зі `seo`, fallback на hero), `notFound()` якщо статті немає, `generateStaticParams`/revalidate за прикладом `/api/revalidate`.
17. `articlePage/hero/Hero.tsx` — hero з desktop/mobile зображенням, градієнтне затемнення, заголовок, опис (`whitespace-pre-line`).
18. `shared/breadcrumbs/Breadcrumbs.tsx` (Головна → Блог → Стаття) + JSON-LD `BreadcrumbList`.
19. `articlePage/portableTextComponents/blogPortableTextComponents.tsx` — **повний паритет зі зразком**: `normal`, `h2`, `h3`, `h4`, `bullet`, `number`, `strong`, `em`, `link` (з `blank`), `image` (з розмірами), `table` (перший рядок — шапка, порожні комірки добиваються, горизонтальний скрол на мобільному). Кольори/шрифти — з токенів проєкту (не білий-на-чорному, а `text-*`/`border` теми).
20. `articlePage/contentSection/ContentSection.tsx` — обгортка `PortableText`.
21. `shared/faqSection/` — перевикористати `FaqItem` з homePage (винести в shared, додати проп-дані замість `useTranslations`), `FaqSection` з `description` + список; JSON-LD `FAQPage`.
22. `articlePage/recommendedPosts/`: `RecommendedPostsDesktop` (sticky sidebar 320px, 3 статті) і `RecommendedPostsMobile` (слайдер на `swiper`, вже є). Виключати поточну статтю, брати найновіші.
23. Розкладка: `lg:flex gap-8` — контент + FAQ ліворуч, рекомендовані праворуч; на мобільному рекомендовані під FAQ.
24. `shared/ArticleSchema.tsx` — JSON-LD `Article` (Kondor як author/publisher, `publishedAt`, `_updatedAt`, image).

### Етап 5. Інтеграція
25. Меню: `NavMenu.tsx` (`blog` перед `faq`), мобільне меню, футер (`Details`/`Important`).
26. `next-sitemap.config.js`: `/blog` у `staticPages`, статті через GROQ `*[_type=="blogPost" && defined(slug.current)]` → `/blog/{slug}` (обидві мови, hreflang).
27. `middleware.ts`/`next.config.mjs`: перевірити, що `/blog*` проходить через i18n-роутинг; `next/image` `remotePatterns` для `cdn.sanity.io`.
28. Revalidate: додати теги/шляхи блогу в `api/revalidate` (webhook Sanity).

### Етап 6. Перевірка
29. Ручна перевірка: uk/ru, світла/темна тема, 375/768/1280+, пагінація (1 сторінка, багато сторінок, `?page=99`), стаття з усіма типами блоків, без FAQ, з довгими таблицями.
30. `npm run lint && npm run build`; Lighthouse/SEO (метадані, canonical, hreflang, JSON-LD через Rich Results Test).
31. PR у обох репозиторіях (спершу адмінка з мігрованою схемою, потім фронтенд).

## Ризики / питання
- Порядок деплою: схему в Sanity треба задеплоїти до фронтенду, інакше GROQ поверне порожньо.
- Rich text двомовний: `content` і `contentRu` дублюють структуру; якщо `contentRu` порожній — фолбек на uk.
- Дата публікації: у зразку використовується `_createdAt`; пропоную явне `publishedAt`.
