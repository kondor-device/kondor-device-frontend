/** @type {import('next-sitemap').IConfig} */

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const GET_ALL_PRODUCTS = `query GetAllProducts {
  allItems {
    slug
  }
}`;

export async function getAllProducts(query, variables = {}) {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}api/datocms`,
      data: {
        query,
        variables,
        includeDrafts: false,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
}

async function getDynamicPages() {
  const res = await getAllProducts(GET_ALL_PRODUCTS);

  const products = res?.data?.allItems || [];
  const productsPages = products.map((product) => `/catalog/${product?.slug}`);

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
