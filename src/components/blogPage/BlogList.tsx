import { useTranslations } from "next-intl";
import { BlogPostPreview } from "@/types/blog";
import BlogCard from "./BlogCard";

interface BlogListProps {
  posts: BlogPostPreview[];
}

export default function BlogList({ posts }: BlogListProps) {
  const t = useTranslations("blogPage");

  if (posts.length === 0) {
    return (
      <p className="py-16 text-center text-16med laptop:text-20med text-fg/60">
        {t("empty")}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 tab:grid-cols-2 tabxl:grid-cols-3 laptop:grid-cols-4 gap-3 tab:gap-4 desk:gap-6">
      {posts.map((post) => (
        <li key={post.slug}>
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  );
}
