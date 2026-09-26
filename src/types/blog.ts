import type { PortableTextBlock } from "@portabletext/react";

/**
 * Blog content types, shaped like the blogPost / blogAuthor GROQ projections.
 * Localized CMS fields (title, description, content, ...) arrive already
 * resolved to the active locale via `$locale` (see `l10n` in lib/queries.ts).
 */

export type BlogAuthor = {
  name: string;
  photo?: string | null;
  photoAlt?: string | null;
  profileUrl?: string | null;
};

export type BlogPostPreview = {
  slug: string;
  title: string;
  description: string;
  image: string | null;
  imageAlt?: string | null;
  publishedAt: string;
};

export type BlogPostsPage = {
  posts: BlogPostPreview[];
  total: number;
};

export type BlogFaqItem = {
  _key: string;
  question: string;
  answer: PortableTextBlock[];
};

export type BlogPostSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  opengraphImage?: string | null;
  schemaJsonUrl?: string | null;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  imageDesktop: string | null;
  imageDesktopAlt?: string | null;
  imageMobile: string | null;
  imageMobileAlt?: string | null;
  publishedAt: string;
  updatedAt: string;
  content: PortableTextBlock[];
  faq?: BlogFaqItem[] | null;
  author?: BlogAuthor | null;
  seo?: BlogPostSeo | null;
};

export type BlogPageSeo = {
  seo?: BlogPostSeo | null;
};

/** Portable Text blocks resolved by GROQ with the extras the serializers need. */
export type BlogImageValue = {
  _key?: string;
  _type: "image";
  asset?: { _ref?: string };
  alt?: string;
  dimensions?: { width: number; height: number } | null;
};

export type BlogGalleryValue = {
  _key?: string;
  _type: "gallerySection";
  items?: { _key?: string; image?: BlogImageValue }[];
};

export type BlogTableValue = {
  _key?: string;
  _type: "table";
  rows?: { _key?: string; cells?: string[] }[];
};

export type BlogButtonValue = {
  _key?: string;
  _type: "faqAnswerButton";
  label?: string;
  href?: string;
  newTab?: boolean;
};
