/** @type {import('next-sitemap').IConfig} */

import axios from "axios";

// Актуальний каталог товарів живе в Sanity (не в застарілому DatoCMS).
const SANITY_PROJECT_ID = "qmszlzqu";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2025-11-11";

export const GET_ALL_PRODUCTS_QUERY = `*[_type == "item" && defined(slug)]{ slug }`;

export async function getAllProducts() {
  try {
    const response = await axios({
      method: "get",
      url: `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`,
      params: { query: GET_ALL_PRODUCTS_QUERY },
    });
    return response.data;
  } catch (error) {
    return error;
  }
}

export const GET_ALL_BLOG_POSTS_QUERY = `*[_type == "blogPost" && defined(slug.current)]{ "slug": slug.current }`;

export async function getAllBlogPosts() {
  try {
    const response = await axios({
      method: "get",
      url: `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`,
      params: { query: GET_ALL_BLOG_POSTS_QUERY },
    });
    return response.data;
  } catch (error) {
    return error;
  }
}

async function getDynamicPages() {
  const [productsRes, blogRes] = await Promise.all([
    getAllProducts(),
    getAllBlogPosts(),
  ]);

  const products = productsRes?.result || [];
  const productsPages = products
    .filter((product) => Boolean(product?.slug))
    .map((product) => ({
      loc: `/catalog/${product.slug}`,
    }));

  const blogPosts = blogRes?.result || [];
  const blogPages = blogPosts
    .filter((post) => Boolean(post?.slug))
    .map((post) => ({
      loc: `/blog/${post.slug}`,
      changefreq: "monthly",
      priority: 0.7,
    }));

  return [...productsPages, ...blogPages];
}

// Домен продакшена (той самий, що CANONICAL_HOST у next.config.mjs)
const SITE_URL = "https://www.kondor.ua";

// Supported locales (keep in sync with src/i18n/routing.ts). The default one has no URL prefix.
const LOCALES = ["uk", "ru"];
const DEFAULT_LOCALE = "uk";

const getLocalizedPath = (locale, path) =>
  locale === DEFAULT_LOCALE ? path : `/${locale}${path === "/" ? "" : path}`;

// One sitemap entry per locale, each one listing all language versions (hreflang) of the page
async function getLocalizedEntries(config, page) {
  const siteUrl = (config.siteUrl || "").replace(/\/$/, "");
  const toUrl = (locale) => `${siteUrl}${getLocalizedPath(locale, page.loc)}`;

  // hrefIsAbsolute: otherwise next-sitemap appends the page path to every href
  const alternateRefs = [
    ...LOCALES.map((locale) => ({
      href: toUrl(locale),
      hreflang: locale,
      hrefIsAbsolute: true,
    })),
    {
      href: toUrl(DEFAULT_LOCALE),
      hreflang: "x-default",
      hrefIsAbsolute: true,
    },
  ];

  return Promise.all(
    LOCALES.map(async (locale) => {
      const transformed = await config.transform(
        config,
        getLocalizedPath(locale, page.loc),
      );

      return {
        ...transformed,
        changefreq: page.changefreq ?? transformed.changefreq,
        priority: page.priority ?? transformed.priority,
        alternateRefs,
      };
    }),
  );
}

const sitemapConfig = {
  // Завжди продакшн-адреса: sitemap.xml і robots.txt лежать у git, тож localhost у них потрапляти не має
  siteUrl: SITE_URL,
  changefreq: "weekly",
  sitemapSize: 5000,
  priority: 0.9,
  generateIndexSitemap: false,
  exclude: ["/api/*"],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          // Товарні фіди (Meta/Facebook, Rozetka тощо) явно виключаємо з
          // індексації пошуковиками окремим правилом для наочності — технічно
          // вони й так покриваються "/api/*" вище, але Meta/Rozetka все одно
          // ходять по прямому URL за розкладом, а не через сканування robots.txt.
          "/api/feed/*",
          // Сторінка підтвердження замовлення (для кожної мови) не для пошуку
          ...LOCALES.map((locale) =>
            getLocalizedPath(locale, "/order-confirmation"),
          ),
        ],
      },
    ],
    // Прибираємо директиву "Host:" — вона застаріла (була лише в Яндекса)
    transformRobotsTxt: async (_config, text) =>
      text.replace(/# Host\nHost: .*\n\n?/, ""),
  },
  additionalPaths: async (config) => {
    const staticPages = [
      {
        loc: "/",
        changefreq: "weekly",
        priority: 1.0,
      },
      {
        loc: "/catalog",
        changefreq: "weekly",
        priority: 1,
      },
      {
        loc: "/about",
        changefreq: "monthly",
        priority: 0.9,
      },
      {
        loc: "/blog",
        changefreq: "weekly",
        priority: 0.8,
      },
      {
        loc: "/delivery",
        changefreq: "monthly",
        priority: 0.9,
      },
      {
        loc: "/returns",
        changefreq: "monthly",
        priority: 0.5,
      },
      {
        loc: "/warranty",
        changefreq: "monthly",
        priority: 0.5,
      },
      {
        loc: "/policy",
        changefreq: "monthly",
        priority: 0.5,
      },
    ];

    const staticPaths = (
      await Promise.all(
        staticPages.map((page) => getLocalizedEntries(config, page)),
      )
    ).flat();

    const dynamicPages = await getDynamicPages(config);
    const dynamicPaths = (
      await Promise.all(
        dynamicPages.map((page) => getLocalizedEntries(config, page)),
      )
    ).flat();

    return [...staticPaths, ...dynamicPaths];
  },
};

// Експортуємо конфігурацію
export default sitemapConfig;
