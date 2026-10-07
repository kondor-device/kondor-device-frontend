export const THEME_STORAGE_KEY = "theme";
export const THEME_QUERY_PARAM = "theme";

// Runs in <head> before the first paint, so the page never flashes the wrong theme.
// Light theme by default. A link with ?theme=dark or ?theme=light sets the theme and
// saves it like the toggle does (only the dark choice is stored); otherwise the saved
// choice is used. The canonical URL has no parameter, so such links are not indexed apart.
export const themeScript = `(function () {
  var isDark = false;
  try {
    var fromUrl = new URLSearchParams(location.search).get("${THEME_QUERY_PARAM}");
    if (fromUrl === "dark" || fromUrl === "light") {
      isDark = fromUrl === "dark";
      if (isDark) localStorage.setItem("${THEME_STORAGE_KEY}", "dark");
      else localStorage.removeItem("${THEME_STORAGE_KEY}");
    } else {
      isDark = localStorage.getItem("${THEME_STORAGE_KEY}") === "dark";
    }
  } catch (e) {}
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.classList.toggle("light", !isDark);
})();`;
