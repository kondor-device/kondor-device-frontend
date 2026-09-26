import { cache } from "react";
import { getProducts } from "@/utils/getProducts";
import { fetchSanityData } from "@/utils/fetchSanityData";
import {
  BLOG_PAGE_SEO_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_POST_SLUGS_QUERY,
  BLOG_POSTS_PAGE_QUERY,
  OTHER_BLOG_POSTS_QUERY,
} from "@/lib/queries";
import { BLOG_OTHER_POSTS_LIMIT, BLOG_POSTS_PER_PAGE } from "@/constants/blog";
import type {
  BlogPageSeo,
  BlogPost,
  BlogPostPreview,
  BlogPostsPage,
} from "@/types/blog";

/**
 * Blog data access layer. Components call these accessors and never touch
 * GROQ directly. Localized fields are resolved in GROQ via `$locale`
 * (getProducts adds it from the request locale).
 */

// One page of posts (1-based) with the total count
export const getBlogPostsPage = cache(
  async (page: number): Promise<BlogPostsPage> => {
    const from = (page - 1) * BLOG_POSTS_PER_PAGE;

    const res = await getProducts(BLOG_POSTS_PAGE_QUERY, {
      from,
      to: from + BLOG_POSTS_PER_PAGE,
    });

    return res?.data ?? { posts: [], total: 0 };
  }
);

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const res = await getProducts(BLOG_POST_BY_SLUG_QUERY, { slug });

    return res?.data ?? null;
  }
);

export const getOtherBlogPosts = cache(
  async (slug: string): Promise<BlogPostPreview[]> => {
    const res = await getProducts(OTHER_BLOG_POSTS_QUERY, {
      slug,
      limit: BLOG_OTHER_POSTS_LIMIT,
    });

    return res?.data ?? [];
  }
);

export const getBlogPageSeo = cache(async (): Promise<BlogPageSeo | null> => {
  const res = await getProducts(BLOG_PAGE_SEO_QUERY);

  return res?.data ?? null;
});

// Slugs do not depend on locale, so the plain fetch is used (for generateStaticParams)
export const getBlogPostSlugs = async (): Promise<string[]> => {
  const res = await fetchSanityData(BLOG_POST_SLUGS_QUERY);

  return res?.data ?? [];
};
