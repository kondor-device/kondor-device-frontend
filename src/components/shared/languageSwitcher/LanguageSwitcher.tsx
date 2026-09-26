"use client";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import { Locale } from "@/types/locale";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({
  className = "",
}: LanguageSwitcherProps) {
  const t = useTranslations("header.language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changeLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;

    const query = searchParams.toString();
    const href = `${pathname}${query ? `?${query}` : ""}${window.location.hash}`;

    router.replace(href, { locale: nextLocale, scroll: false });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`flex items-center gap-x-0 tabxl:gap-x-1 text-[14px] font-bold leading-[17px] tabxl:text-14bold laptop:text-16bold ${className}`}
    >
      {routing.locales.map((item, index) => {
        const isActive = item === locale;

        return (
          <React.Fragment key={item}>
            {index > 0 && (
              <span aria-hidden="true" className="text-fg/40">
                |
              </span>
            )}
            <button
              type="button"
              lang={item}
              onClick={() => changeLocale(item)}
              aria-pressed={isActive}
              aria-label={t(item)}
              title={t(item)}
              className={`px-0.5 tabxl:px-1 uppercase outline-none transition duration-300 ease-out active:text-yellow focus-visible:text-yellow laptop:hover:text-yellow ${
                isActive ? "text-yellow" : "text-fg"
              }`}
            >
              {item}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
