export const THEME_STORAGE_KEY = "theme";

// Runs in <head> before the first paint, so the page never flashes the wrong theme.
// No saved choice -> follow the system theme (and keep following it when it changes).
export const themeScript = `(function () {
  var key = "${THEME_STORAGE_KEY}";
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  function saved() {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function apply(isDark) {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }
  var theme = saved();
  apply(theme ? theme === "dark" : media.matches);
  media.addEventListener("change", function (e) {
    if (!saved()) apply(e.matches);
  });
})();`;
