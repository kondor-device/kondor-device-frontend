"use client";
import { useEffect } from "react";
import { THEME_STORAGE_KEY } from "./themeScript";

// The theme class on <html> is set by themeScript before hydration, but it is lost when the
// root layout re-renders on client navigation (e.g. switching the language).
// Restores it whenever neither class is present, by the same rule as themeScript: dark only
// if the user chose it (the system theme is ignored, light is the default).
export default function ThemeKeeper() {
  useEffect(() => {
    const html = document.documentElement;

    const restoreTheme = () => {
      if (html.classList.contains("dark") || html.classList.contains("light")) {
        return;
      }

      let saved: string | null = null;
      try {
        saved = localStorage.getItem(THEME_STORAGE_KEY);
      } catch {}

      const isDark = saved === "dark";

      html.classList.toggle("dark", isDark);
      html.classList.toggle("light", !isDark);
    };

    restoreTheme();

    // Runs right after the class attribute changes, before the next paint
    const observer = new MutationObserver(restoreTheme);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return null;
}
