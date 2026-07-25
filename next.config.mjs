import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const CANONICAL_HOST = "www.kondor.ua";
// Vercel keeps the project's production alias reachable alongside the real
// domain. It serves a byte-identical copy of the site — including the same GTM
// container — so every hit there lands in the same GA4 property under a second
// hostname. That reads as duplicated events, and a visit crossing between the
// two hosts starts a fresh session whose source is a self-referral, wiping out
// the original ad attribution.
const VERCEL_ALIAS_HOST = "kondor-device-frontend.vercel.app";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        // Nothing points server-to-server at the alias — every webhook and
        // callback URL is built from NEXT_PUBLIC_BASE_URL — so the whole host
        // can be folded onto the canonical domain. Query strings are carried
        // over automatically, keeping utm_* and gclid intact.
        source: "/:path*",
        has: [{ type: "host", value: VERCEL_ALIAS_HOST }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Per-deployment preview URLs (`…-<hash>.vercel.app`) are not covered
        // by the redirect above and are publicly crawlable, so keep them out
        // of the index. Does not match the apex/www domain.
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.datocms-assets.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
