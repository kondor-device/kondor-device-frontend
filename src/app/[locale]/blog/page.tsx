import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Blog from "@/components/blogPage/Blog";
import { BLOG_POSTS_PER_PAGE } from "@/constants/blog";
import { getBlogPageSeo, getBlogPostsPage } from "@/data/blog";
import { Locale } from "@/types/locale";
import { OG_LOCALES } from "@/utils/getDefaultMetadata";
import { getPageAlternates } from "@/utils/getPageAlternates";

interface BlogPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
}

// ?page=abc, ?page=0, ?page=-1 fall back to the first page
const parsePage = (value?: string) => {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
};

export async function generateMetadata({
  params,
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const [{ locale }, { page: pageParam }] = await Promise.all([
    params,
    searchParams,
  ]);
  const page = parsePage(pageParam);

  const [t, tBlog, pageSeo] = await Promise.all([
    getTranslations({ locale, namespace: "metadata.blog" }),
    getTranslations({ locale, namespace: "blogPage" }),
    getBlogPageSeo(),
  ]);

  const seo = pageSeo?.seo;
  const baseTitle = seo?.metaTitle || t("title");
  // Paginated pages get their own title, so they are not duplicates of the first one
  const title =
    page > 1 ? `${baseTitle} — ${tBlog("page", { page })}` : baseTitle;
  const description = seo?.metaDescription || t("description");

  return {
    title,
    description,
    alternates: getPageAlternates(
      locale,
      page > 1 ? `/blog?page=${page}` : "/blog",
    ),
    // openGraph of a page replaces the layout one, so it is filled in full
    openGraph: {
      title,
      description,
      type: "website",
      locale: OG_LOCALES[locale],
      alternateLocale: Object.values(OG_LOCALES).filter(
        (item) => item !== OG_LOCALES[locale],
      ),
      siteName: "Kondor Device",
      images: [
        {
          url: seo?.opengraphImage || "/opengraph-image.jpg",
          width: 1200,
          height: 630,
          alt: "Kondor Device",
        },
      ],
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = parsePage(pageParam);

  const { posts, total } = await getBlogPostsPage(currentPage);
  const totalPages = Math.ceil(total / BLOG_POSTS_PER_PAGE);

  // A page beyond the last one does not exist (an empty blog still renders page 1)
  if (currentPage > 1 && posts.length === 0) notFound();

  return (
    <div className="pt-[60px] tabxl:pt-[113px] pb-[calc(104px+env(safe-area-inset-bottom,0px))] tabxl:pb-[88px]">
      <Blog posts={posts} currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
