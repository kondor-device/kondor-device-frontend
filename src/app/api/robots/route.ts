import { NextResponse } from "next/server";
import { SITE_ALLOW_INDEXING, SITE_URL } from "@/lib/seo/constants";

// Served at /robots.txt (rewrite in next.config.mjs).
// Pages that must stay out of the index (order confirmation) carry a noindex meta tag instead
// of a Disallow rule: a blocked page cannot be crawled, so the tag would never be seen.
export const dynamic = "force-static";

export function GET() {
  const robotsTxt = SITE_ALLOW_INDEXING
    ? [
        "User-agent: *",
        "Allow: /",
        "Disallow: /api/",
        "",
        `Sitemap: ${SITE_URL}/sitemap.xml`,
        "",
      ]
    : ["User-agent: *", "Disallow: /", ""];

  return new NextResponse(robotsTxt.join("\n"), {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
