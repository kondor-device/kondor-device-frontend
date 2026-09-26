export const THEME_STORAGE_KEY = "theme";

// Runs in <head> before the first paint, so the page never flashes the wrong theme.
// Light theme by default; dark only if the user switched to it with the toggle.
export const themeScript = `(function () {
  var isDark = false;
  try { isDark = localStorage.getItem("${THEME_STORAGE_KEY}") === "dark"; } catch (e) {}
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.classList.toggle("light", !isDark);
})();`;
