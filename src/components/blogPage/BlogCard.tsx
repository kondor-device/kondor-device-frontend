import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Locale } from "@/types/locale";
import { BlogPostPreview } from "@/types/blog";
import { formatBlogDate } from "@/utils/formatBlogDate";

interface BlogCardProps {
  post: BlogPostPreview;
  className?: string;
}

export default function BlogCard({ post, className = "" }: BlogCardProps) {
  const t = useTranslations("blogPage");
  const locale = useLocale() as Locale;

  const { slug, title, description, image, imageAlt, publishedAt } = post;

  return (
    <Link
      href={`/blog/${slug}`}
      className={`group flex flex-col h-full p-3 desk:p-4 rounded-[8px] desk:rounded-[20px] shadow-catalogCard bg-surface ${className}`}
    >
      <div className="relative aspect-[16/10] w-full mb-3 desk:mb-4 rounded-[12px] bg-white overflow-hidden">
        <Image
          src={image || "/images/icons/logoSmall.svg"}
          alt={imageAlt || title}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
          className={`transition duration-1000 ease-in-out laptop:group-hover:scale-105 ${
            image ? "object-cover" : "object-contain p-10"
          }`}
        />
      </div>

      <time dateTime={publishedAt} className="mb-2 text-12med text-fg/60">
        {formatBlogDate(publishedAt, locale)}
      </time>
      <h3 className="mb-2 desk:mb-3 line-clamp-2 text-14bold desk:text-18bold transition duration-300 ease-in-out laptop:group-hover:text-yellow group-focus-visible:text-yellow">
        {title}
      </h3>
      <p className="mb-4 line-clamp-3 text-12med desk:text-14med text-fg/70">
        {description}
      </p>
      <span className="mt-auto flex items-center gap-2 w-fit text-12bold desk:text-14bold text-yellow">
        {t("readMore")}
        <span
          aria-hidden
          className="transition duration-300 ease-in-out laptop:group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}
