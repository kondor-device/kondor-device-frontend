import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ArticleContent from "@/components/articlePage/ArticleContent";
import ArticleHero from "@/components/articlePage/ArticleHero";
import BlogFaq from "@/components/articlePage/BlogFaq";
import OtherPosts from "@/components/articlePage/OtherPosts";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";
import JsonLd from "@/components/shared/JsonLd";
import { getBlogPostBySlug, getOtherBlogPosts } from "@/data/blog";
import { Locale } from "@/types/locale";
import { OG_LOCALES } from "@/utils/getDefaultMetadata";
import { getLocalizedPath, getPageAlternates } from "@/utils/getPageAlternates";

interface ArticlePageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

// Extra structured data uploaded to the article SEO block in the CMS (a JSON file)
const getCustomSchema = async (url?: string | null) => {
  if (!url) return null;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const json = await res.json();

    return json && typeof json === "object" ? json : null;
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.description;
  const image =
    post.seo?.opengraphImage ||
    post.imageDesktop ||
    post.imageMobile ||
    "/opengraph-image.jpg";

  return {
    title,
    description,
    alternates: getPageAlternates(locale, `/blog/${slug}`),
    // openGraph of a page replaces the layout one, so it is filled in full
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      locale: OG_LOCALES[locale],
      alternateLocale: Object.values(OG_LOCALES).filter(
        (item) => item !== OG_LOCALES[locale],
      ),
      siteName: "Kondor Device",
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;

  const [post, tBlog] = await Promise.all([
    getBlogPostBySlug(slug),
    getTranslations({ locale, namespace: "blogPage" }),
  ]);

  if (!post) notFound();

  const otherPosts = await getOtherBlogPosts(slug);
  const customSchema = await getCustomSchema(post.seo?.schemaJsonUrl);
  const image = post.imageDesktop || post.imageMobile;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}${getLocalizedPath(locale, `/blog/${slug}`)}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: locale,
    ...(image ? { image: [image] } : {}),
    ...(post.author?.name
      ? { author: { "@type": "Person", name: post.author.name } }
      : {}),
    publisher: { "@type": "Organization", name: "Kondor Device" },
  };

  return (
    <div className="pt-[60px] tabxl:pt-[113px] pb-[calc(104px+env(safe-area-inset-bottom,0px))] tabxl:pb-[88px]">
      <JsonLd data={articleSchema} />
      {customSchema && <JsonLd data={customSchema} />}

      <ArticleHero post={post} />
      <Breadcrumbs
        items={[
          { label: tBlog("heroTitle"), href: "/blog" },
          { label: post.title },
        ]}
        className="pt-4 laptop:pt-6"
      />

      <div className="container w-full max-w-[1920px] pt-8 laptop:pt-12 laptop:flex laptop:gap-10 desk:gap-16">
        <article className="min-w-0 laptop:flex-1 laptop:max-w-[860px]">
          <ArticleContent content={post.content} />
          <BlogFaq items={post.faq ?? []} />
        </article>
        <OtherPosts posts={otherPosts} />
      </div>
    </div>
  );
}
