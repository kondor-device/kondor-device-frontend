/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL,
  changefreq: "monthly",
  sitemapSize: 5000,
  priority: 0.7,
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
        loc: "/about",
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
    return staticPaths;
  },
};
