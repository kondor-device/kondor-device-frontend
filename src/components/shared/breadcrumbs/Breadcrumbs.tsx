import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Locale } from "@/types/locale";
import { getLocalizedPath } from "@/utils/getPageAlternates";

export interface BreadcrumbItem {
  label: string;
  /** Path without locale. Omit on the current page: it is rendered as plain text. */
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

/**
 * Breadcrumb trail with BreadcrumbList JSON-LD. The "home" link is
 * prepended automatically, pages pass only the segments below it.
 */
export default async function Breadcrumbs({
  items,
  className = "",
}: BreadcrumbsProps) {
  const [t, locale] = await Promise.all([
    getTranslations("breadcrumbs"),
    getLocale() as Promise<Locale>,
  ]);

  const trail: BreadcrumbItem[] = [{ label: t("home"), href: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      ...(item.href
        ? { item: `${SITE_URL}${getLocalizedPath(locale, item.href)}` }
        : {}),
    })),
  };

  return (
    <nav
      aria-label={t("label")}
      className={`container w-full max-w-[1920px] ${className}`}
    >
      {/* One line only: every level is written in full, only the last one (the current page,
          usually the longest) is cut with an ellipsis when it does not fit the screen width */}
      <ol className="flex flex-nowrap items-center gap-x-1.5 tab:gap-x-2 overflow-hidden whitespace-nowrap text-12med laptop:text-14med text-fg/60">
        {trail.map((item, idx) => {
          const isLast = idx === trail.length - 1;

          return (
            <li
              key={`${item.label}-${idx}`}
              className={`flex items-center gap-x-1.5 tab:gap-x-2 ${
                isLast ? "min-w-0" : "shrink-0"
              }`}
            >
              {idx > 0 && (
                <span aria-hidden className="shrink-0">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="block min-w-0 truncate text-fg"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition duration-300 ease-in-out laptop:hover:text-yellow focus-visible:text-yellow"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </nav>
  );
}
