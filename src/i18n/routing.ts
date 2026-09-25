import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["uk", "ru"],

  // Used when no locale matches
  defaultLocale: "uk",
  localePrefix: "as-needed",
  // Завжди українська за замовчуванням: не визначаємо мову за Accept-Language і cookie
  localeDetection: false,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
