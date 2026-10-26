export const PRODUCT_SECTION_EVENT = "kondor:product-section";

/** Keep the sticky tabs in sync with links outside the tab bar. */
export function scrollToProductSection(id: string, section = id) {
  const element = document.getElementById(id);
  if (!element) return;
  document.dispatchEvent(new CustomEvent(PRODUCT_SECTION_EVENT, { detail: section }));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}
