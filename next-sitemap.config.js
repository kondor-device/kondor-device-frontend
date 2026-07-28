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

async function getDynamicPages() {
  const res = await getAllProducts();

  const products = res?.result || [];
  const productsPages = products
    .filter((product) => Boolean(product?.slug))
    .map((product) => `/catalog/${product.slug}`);

  return productsPages;
}

const sitemapConfig = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL,
  changefreq: "weekly",
  sitemapSize: 5000,
  priority: 0.9,
  generateIndexSitemap: false,
  exclude: ["/api/*"],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/api/*" },
      // Товарні фіди (Meta/Facebook, Rozetka тощо) явно виключаємо з
      // індексації пошуковиками окремим правилом для наочності — технічно
      // вони й так покриваються "/api/*" вище, але Meta/Rozetka все одно
      // ходять по прямому URL за розкладом, а не через сканування robots.txt.
      { userAgent: "*", disallow: "/api/feed/*" },
    ],
  },
  alternateRefs: [
    {
      href: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      hreflang: "uk",
    },
  ],
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
        loc: "/delivery",
        changefreq: "monthly",
        priority: 0.9,
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

    const staticPaths = await Promise.all(
      staticPages.map(async (page) => {
        const transformed = await config.transform(config, page.loc);
        return {
          ...transformed,
          changefreq: page.changefreq,
          priority: page.priority,
        };
      })
    );

    const dynamicPages = await getDynamicPages(config);
    const dynamicPaths = await Promise.all(
      dynamicPages.map((page) => config.transform(config, page))
    );

    return [...staticPaths, ...dynamicPaths];
  },
};

// Експортуємо конфігурацію
export default sitemapConfig;
