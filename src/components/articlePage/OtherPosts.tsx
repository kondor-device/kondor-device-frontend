import { getTranslations } from "next-intl/server";
import BlogCard from "../blogPage/BlogCard";
import { BlogPostPreview } from "@/types/blog";
import OtherPostsSlider from "./OtherPostsSlider";

interface OtherPostsProps {
  posts: BlogPostPreview[];
}

/** Recommended articles: sticky sidebar on desktop, slider below the article on smaller screens. */
export default async function OtherPosts({ posts }: OtherPostsProps) {
  const t = await getTranslations("blogPage");

  if (posts.length === 0) return null;

  return (
    <aside className="mt-12 laptop:mt-0 laptop:w-[300px] desk:w-[340px] laptop:shrink-0 laptop:self-start laptop:sticky laptop:top-[130px] min-w-0">
      <h2 className="mb-5 laptop:mb-6 text-22bold laptop:text-24bold">
        {t("otherPostsTitle")}
      </h2>
      <div className="laptop:hidden">
        <OtherPostsSlider posts={posts} />
      </div>
      <ul className="hidden laptop:flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </aside>
  );
}
