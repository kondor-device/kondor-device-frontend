import Image from "next/image";
import { getLocale } from "next-intl/server";
import { BlogPost } from "@/types/blog";
import { Locale } from "@/types/locale";
import { formatBlogDate } from "@/utils/formatBlogDate";

interface ArticleHeroProps {
  post: BlogPost;
}

/** Full-width header: mobile/desktop cover, dark scrim, title, lead, author and date. */
export default async function ArticleHero({ post }: ArticleHeroProps) {
  const locale = (await getLocale()) as Locale;

  const {
    title,
    description,
    imageDesktop,
    imageDesktopAlt,
    imageMobile,
    imageMobileAlt,
    publishedAt,
    author,
  } = post;

  const mobileSrc = imageMobile || imageDesktop;
  const desktopSrc = imageDesktop || imageMobile;

  return (
    <header className="relative flex items-end min-h-[320px] tab:min-h-[400px] laptop:min-h-[480px] bg-dark overflow-hidden">
      {mobileSrc && (
        <Image
          src={mobileSrc}
          alt={imageMobileAlt || title}
          fill
          priority
          sizes="100vw"
          className="tab:hidden object-cover"
        />
      )}
      {desktopSrc && (
        <Image
          src={desktopSrc}
          alt={imageDesktopAlt || title}
          fill
          priority
          sizes="100vw"
          className="hidden tab:block object-cover"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20"
      />

      <div className="relative container w-full max-w-[1920px] py-6 tab:py-10 laptop:py-14 text-white">
        <h1 className="max-w-[980px] mb-3 laptop:mb-5 text-22bold tab:text-32bold laptop:text-40bold">
          {title}
        </h1>
        {description && (
          <p className="max-w-[820px] mb-5 laptop:mb-8 text-12med laptop:text-18med text-white/85 whitespace-pre-line">
            {description}
          </p>
        )}
        <div className="flex items-center gap-3">
          {author?.photo && (
            <span className="relative size-10 laptop:size-12 shrink-0 rounded-full overflow-hidden ring-2 ring-white/40">
              <Image
                src={author.photo}
                alt={author.photoAlt || author.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </span>
          )}
          <div className="flex flex-col gap-1">
            {author?.name && (
              <span className="text-14bold laptop:text-16bold">
                {author.name}
              </span>
            )}
            <time
              dateTime={publishedAt}
              className="text-12med laptop:text-14med text-white/70"
            >
              {formatBlogDate(publishedAt, locale)}
            </time>
          </div>
        </div>
      </div>
    </header>
  );
}
