// Addresses that existed before and still get visits from Google, ads, the Instagram bot
// and old posts. Without an entry here they answer 404.
// Maps, not plain objects: the key comes from the URL, and a plain object would also
// "contain" words like "constructor".

// Categories merged into the current ones (the keyboard series became one "Клавіатури"
// category, keycap sets moved to "Додаткові товари"). Old slug -> current category slug.
export const LEGACY_CATEGORY_REDIRECTS: ReadonlyMap<string, string> = new Map([
  ["klaviaturi-orion", "klaviaturi"],
  ["klaviaturi-legion", "klaviaturi"],
  ["klaviaturi-moonlight", "klaviaturi"],
  ["klaviaturi-starlight", "klaviaturi"],
  ["komplekti-keykapiv", "dodatkovi-tovari"],
]);

// Products that are no longer in Sanity but whose addresses were shown in Google
// (Search Console, 27.08-26.11.2026). Product slug -> category the visitor is sent to
// instead of a 404. When a product gets a direct successor, point it there instead.
export const REMOVED_PRODUCT_REDIRECTS: ReadonlyMap<string, string> = new Map([
  ["kondor-starlight-magnetic", "klaviaturi"],
  ["kondor-orion-pro", "klaviaturi"],
  ["kondor-moonlight-x-grey", "klaviaturi"],
  ["keycap-white-pink", "dodatkovi-tovari"],
  ["kondor-surface-xxl1", "igrovi-poverhni"],
  ["kondor-surface-xxl-neon-garden", "igrovi-poverhni"],
]);
