import { groq } from "next-sanity";

// Localized GROQ expression: the Russian value (`<field>Ru`) when $locale is "ru" and it is filled,
// otherwise the Ukrainian one. $locale defaults to "uk" in the /api/sanity route.
const l10n = (field: string) =>
  `select($locale == "ru" && length(${field}Ru) > 0 => ${field}Ru, ${field})`;

// `"<field>": <localized value>`
const l10nField = (field: string) => `"${field}": ${l10n(field)}`;

const IMAGE_PROJECTION = `"alt": coalesce(${l10n("alt")}, ""), "url": asset->url`;

// Feeds are not localized (they do not receive $locale)
const FEED_IMAGE_PROJECTION = `"alt": coalesce(alt, ""), "url": asset->url`;

const BADGE_PROJECTION = `
  "badge": badge->{
    ${l10nField("text")},
    "backgroundColor": select(defined(backgroundColor.hex) => { "hex": backgroundColor.hex })
  }
`;

export const COLOR_OPTIONS_PROJECTION = `
  code,
  ${l10nField("color")},
  "colorset": {
    "hex": coalesce(colorset.hex.hex, colorset.hex)
  },
  "photos": photos[]{${IMAGE_PROJECTION}}
`;

const COMPLECT_PROJECTION = `
  ${l10nField("name")},
  "icon": icon{ ${IMAGE_PROJECTION} }
`;

const CHARS_PROJECTION = `${l10nField("name")}, ${l10nField("char")}`;

const CATEGORY_PROJECTION = `
  "id": _id,
  ${l10nField("name")},
  pos,
  slug,
  "image": image{ ${IMAGE_PROJECTION} },
  "items": items[]->{
    "id": _id,
    ${l10nField("generalname")},
    ${l10nField("name")},
    slug,
    price,
    priceDiscount,
    showonaddons,
    showonmain,
    ${BADGE_PROJECTION},
    preorder,
    ${l10nField("preordertext")},
    outOfStock,
    "chars": chars[]{ ${CHARS_PROJECTION} },
    "coloropts": coloropts[]{ ${COLOR_OPTIONS_PROJECTION} },
    "complect": complect[]{ ${COMPLECT_PROJECTION} }
  }
`;

const ADDONS_PROJECTION = `
  "id": _id,
  preorder,
  ${l10nField("preordertext")},
  outOfStock,
  "coloropts": coloropts[]{
    ${l10nField("color")},
    code,
    "photos": photos[]{ ${IMAGE_PROJECTION} }
  },
  ${l10nField("generalname")},
  ${l10nField("name")},
  price,
  priceDiscount,
  ${BADGE_PROJECTION}
`;

const MAIN_PRODUCTS_PROJECTION = `
  "id": _id,
  ${l10nField("name")},
  slug,
  price,
  priceDiscount,
  "cat": cat->{ "id": _id, ${l10nField("name")} },
  "coloropts": coloropts[]{
    "photos": photos[]{ ${IMAGE_PROJECTION} }
  },
  ${BADGE_PROJECTION}
`;

const ITEM_DETAIL_PROJECTION = `
  "id": _id,
  ${l10nField("generalname")},
  ${l10nField("name")},
  ${l10nField("seoTitle")},
  ${l10nField("seoDescription")},
  "seoImage": select(defined(seoImage.asset->url) => { "url": seoImage.asset->url }),
  slug,
  price,
  priceDiscount,
  ${l10nField("description")},
  manual,
  driver,
  "video": select(defined(video.url) => { "url": video.url }),
  newItem,
  showonaddons,
  showonmain,
  ${BADGE_PROJECTION},
  preorder,
  ${l10nField("preordertext")},
  outOfStock,
  "chars": chars[]{ ${CHARS_PROJECTION} },
  "coloropts": coloropts[]{ ${COLOR_OPTIONS_PROJECTION} },
  "complect": complect[]{ ${COMPLECT_PROJECTION} }
`;

export const GET_ALL_DATA_QUERY = groq`
{
  "allCategories": *[_type == "category"] | order(pos asc) {
    ${CATEGORY_PROJECTION}
  },
  "shownOnMainProducts": *[_type == "item" && showonmain == true] | order(order asc) {
    ${MAIN_PRODUCTS_PROJECTION}
  },
  "shownOnAddons": *[_type == "item" && showonaddons == true] {
    ${ADDONS_PROJECTION}
  }
}
`;

export const GET_PRODUCTS_BY_IDS = groq`
{
  "allItems": *[_type == "item" && _id in $ids] {
    "id": _id,
    price,
    priceDiscount,
    outOfStock
  }
}
`;

export const GET_PROMOCODE_BY_CODE = groq`
{
  "allPromocodes": *[_type == "promocode" && promocode == $code] {
    promocode,
    discount
  }
}
`;

export const GET_ALL_CATEGORIES_QUERY = groq`
{
  "allCategories": *[_type == "category"] {
    ${CATEGORY_PROJECTION}
  },
  "shownOnAddons": *[_type == "item" && showonaddons == true] {
    ${ADDONS_PROJECTION}
  }
}
`;

export const GET_CATEGORIES_BY_SLUGS_QUERY = groq`
{
  "selectedCategories": *[_type == "category" && slug in $categories] | order(pos asc) {
    ${CATEGORY_PROJECTION}
  },
  "allCategories": *[_type == "category"] | order(pos asc) {
    ${CATEGORY_PROJECTION}
  },
  "shownOnAddons": *[_type == "item" && showonaddons == true] {
    ${ADDONS_PROJECTION}
  }
}
`;

export const GET_ITEM_BY_SLUG_QUERY = groq`
{
  "allItems": *[_type == "item" && slug == $slug][0...1] {
    ${ITEM_DETAIL_PROJECTION}
  },
  "shownOnAddons": *[_type == "item" && showonaddons == true] {
    ${ADDONS_PROJECTION}
  },
  "allCategories": *[_type == "category"] | order(pos asc) {
    ${CATEGORY_PROJECTION}
  }
}
`;

// Проекція товару для товарних фідів (Meta/Facebook Catalog, Rozetka тощо).
// Містить лише поля, необхідні для формування offer'ів фіда: SKU/варіанти,
// ціну, наявність, посилання на картку товару та зображення, категорію.
const FEED_PRODUCT_PROJECTION = `
  "id": _id,
  generalname,
  name,
  slug,
  description,
  price,
  priceDiscount,
  preorder,
  preordertext,
  outOfStock,
  "cat": cat->{ "id": _id, name, slug },
  "coloropts": coloropts[]{
    code,
    color,
    "photos": photos[]{ ${FEED_IMAGE_PROJECTION} }
  }
`;

// Всі опубліковані товари з усіма полями, потрібними для генерації
// динамічного XML/YML фіда каталогу (Meta, Rozetka тощо).
//
// _type == "item" вже сам собою виключає документи типу "category" —
// окремі "категорії" з адмінки в цей запит і так не потраплять.
//
// Серед документів "item" є кілька службових "застав"-банерів для
// головної сторінки (showonmain: true) — це не реальні товари, а
// декоративні банери категорій (порожні chars/complect/description).
// Виключаємо їх за showonmain == true.
export const GET_FEED_PRODUCTS_QUERY = groq`
*[
  _type == "item" &&
  defined(slug) &&
  defined(price) &&
  showonmain != true
] {
  ${FEED_PRODUCT_PROJECTION}
}
`;
