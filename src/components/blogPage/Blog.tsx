import { useTranslations } from "next-intl";
import PageTitle from "../shared/titles/PageTitle";
import Breadcrumbs from "../shared/breadcrumbs/Breadcrumbs";
import Pagination from "../shared/pagination/Pagination";
import BlogList from "./BlogList";
import { BlogPostPreview } from "@/types/blog";

interface BlogProps {
  posts: BlogPostPreview[];
  currentPage: number;
  totalPages: number;
}

export default function Blog({ posts, currentPage, totalPages }: BlogProps) {
  const t = useTranslations("blogPage");

  return (
    <>
      <PageTitle>{t("heroTitle")}</PageTitle>
      <Breadcrumbs
        items={[{ label: t("heroTitle") }]}
        className="pt-4 laptop:pt-6"
      />
      <section className="container w-full max-w-[1920px] pt-12 laptop:pt-20">
        <BlogList posts={posts} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/blog"
        />
      </section>
    </>
  );
}
