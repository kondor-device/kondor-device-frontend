"use client";
import React, { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { THEME_QUERY_PARAM, THEME_STORAGE_KEY } from "./themeScript";

interface ThemeToggleProps {
  className?: string;
}

const subscribe = (callback: () => void) => {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
};

const getIsDark = () => document.documentElement.classList.contains("dark");

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const t = useTranslations("header.theme");
  const isDark = useSyncExternalStore(subscribe, getIsDark, () => false);

  const toggleTheme = () => {
    const nextIsDark = !isDark;

    // Only the dark choice is stored; light is the default
    try {
      if (nextIsDark) {
        localStorage.setItem(THEME_STORAGE_KEY, "dark");
      } else {
        localStorage.removeItem(THEME_STORAGE_KEY);
      }
    } catch {}

    document.documentElement.classList.toggle("dark", nextIsDark);
    document.documentElement.classList.toggle("light", !nextIsDark);

    // The user picked a theme themselves: the one from the link no longer applies, so drop it.
    // replaceState: no navigation and no history entry; other parameters and the hash stay.
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has(THEME_QUERY_PARAM)) {
        url.searchParams.delete(THEME_QUERY_PARAM);
        window.history.replaceState(
          window.history.state,
          "",
          `${url.pathname}${url.search}${url.hash}`,
        );
      }
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("toLight") : t("toDark")}
      title={isDark ? t("toLight") : t("toDark")}
      className={`flex items-center justify-center size-9 tabxl:size-10 rounded-full text-fg outline-none transition duration-300 ease-out
        active:scale-95 active:text-yellow focus-visible:text-yellow laptop:hover:text-yellow ${className}`}
    >
      {isDark ? (
        <svg
          width="24"
          height="24"
          className="size-[22px] tabxl:size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          className="size-[22px] tabxl:size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
