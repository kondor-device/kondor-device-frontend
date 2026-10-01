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

// Localized `seoSettings` block (categories and SEO pages of the admin). The share image is
// a plain CDN url: the site crops it to 1200×630 itself.
const SEO_PROJECTION = `
  ${l10nField("metaTitle")},
  ${l10nField("metaDescription")},
  "keywords": select($locale == "ru" && count(keywordsRu) > 0 => keywordsRu, keywords),
  ${l10nField("opengraphTitle")},
  ${l10nField("opengraphDescription")},
  "opengraphImage": select(defined(opengraphImage.asset->url) => {
    "url": opengraphImage.asset->url,
    "alt": ${l10n("opengraphImage.alt")}
  }),
  "schemaJsonUrl": schemaJson.asset->url
`;

const BADGE_PROJECTION = `
  "badge": badge->{
    ${l10nField("text")},
    "backgroundColor": select(defined(backgroundColor.hex) => { "hex": backgroundColor.hex })
  }
`;

export const COLOR_OPTIONS_PROJECTION = `
  code,
  ${l10nField("color")},
  "colorUk": color,
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

// Bundle (set) = 2–3 fixed products (with fixed colors) sold together for one price.
// It is available only while every component is in stock: otherwise it cannot be bought,
// so it is dropped from every list and its page returns 404. Used inside a bundle projection.
const BUNDLE_AVAILABLE = `count(components) >= 2 && count(components[!defined(item->_id) || item->outOfStock == true]) == 0`;

// One fixed line of a bundle. `^` in the color filter is the component (its colorCode).
const BUNDLE_COMPONENT_PROJECTION = `
  "itemId": item->_id,
  "slug": item->slug,
  "categorySlug": item->cat->slug,
  "generalname": ${l10n("item->generalname")},
  "name": ${l10n("item->name")},
  "code": colorCode,
  "colorOpt": item->coloropts[code == ^.colorCode][0]{ ${COLOR_OPTIONS_PROJECTION} },
  "generalnameUk": item->generalname,
  "nameUk": item->name,
  "price": item->price,
  "priceDiscount": item->priceDiscount,
  "outOfStock": coalesce(item->outOfStock, false)
`;

// Sum of the components' current prices (discounted price when it is lower).
// The savings themselves are calculated on the site, in utils/bundlePricing.ts.
const BUNDLE_REGULAR_PRICE = `math::sum(components[].item->{ "p": select(priceDiscount > 0 && priceDiscount < price => priceDiscount, price) }.p)`;

// Bundle in the shape of a catalog card (see ProductItem, kind: "bundle"), so that it flows
// through the category lists, filters and sorting like a product.
const BUNDLE_CARD_PROJECTION = `
  "kind": "bundle",
  "generalname": "",
  ${l10nField("name")},
  "generalnameUk": "",
  "nameUk": name,
  slug,
  "price": ${BUNDLE_REGULAR_PRICE},
  "priceDiscount": bundlePrice,
  "newItem": false,
  "showonaddons": false,
  "preorder": false,
  "outOfStock": coalesce(outOfStock, false),
  "chars": [],
  "coloropts": [],
  "complect": [],
  "bundlePhotos": photos[]{ ${IMAGE_PROJECTION} },
  "bundleComponents": components[]{ ${BUNDLE_COMPONENT_PROJECTION} }
`;

const BUNDLE_DETAIL_PROJECTION = `
  "id": _id,
  ${l10nField("name")},
  "nameUk": name,
  slug,
  bundlePrice,
  "outOfStock": coalesce(outOfStock, false),
  ${l10nField("description")},
  ${l10nField("seoTitle")},
  ${l10nField("seoDescription")},
  "seoImage": select(defined(seoImage.asset->url) => { "url": seoImage.asset->url }),
  "photos": photos[]{ ${IMAGE_PROJECTION} },
  "components": components[]{ ${BUNDLE_COMPONENT_PROJECTION} }
`;

const CATEGORY_PROJECTION = `
  "id": _id,
  ${l10nField("name")},
  pos,
  slug,
  "image": image{ ${IMAGE_PROJECTION} },
  // a category without any items (the field is missing) has an empty list, not null
  "items": coalesce((items[]->)[_type != "bundle" || (${BUNDLE_AVAILABLE})]{
    "id": _id,
    _type == "bundle" => {
      ${BUNDLE_CARD_PROJECTION}
    },
    _type != "bundle" => {
      ${l10nField("generalname")},
      ${l10nField("name")},
      "generalnameUk": generalname,
      "nameUk": name,
      slug,
      price,
      priceDiscount,
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
    }
  }, [])
`;

const ADDONS_PROJECTION = `
  "id": _id,
  preorder,
  ${l10nField("preordertext")},
  outOfStock,
  "coloropts": coloropts[]{
    ${l10nField("color")},
    "colorUk": color,
    code,
    "photos": photos[]{ ${IMAGE_PROJECTION} }
  },
  ${l10nField("generalname")},
  ${l10nField("name")},
  "generalnameUk": generalname,
  "nameUk": name,
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
  "generalnameUk": generalname,
  "nameUk": name,
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
    outOfStock,
    ${l10nField("generalname")},
    ${l10nField("name")},
    ${l10nField("preordertext")},
    "generalnameUk": generalname,
    "nameUk": name,
    "coloropts": coloropts[]{ code, ${l10nField("color")}, "colorUk": color }
  }
}
`;

// Bundles of the cart. Unlike the catalog lists, an unavailable bundle is returned here too
// (with outOfStock: true; also when the set is switched to "out of stock" in the admin), so
// the cart can flag it instead of silently dropping it.
export const GET_BUNDLES_BY_IDS = groq`
{
  "allBundles": *[_type == "bundle" && _id in $ids] {
    "id": _id,
    ${l10nField("name")},
    "nameUk": name,
    bundlePrice,
    "outOfStock": !(${BUNDLE_AVAILABLE}) || coalesce(outOfStock, false),
    "components": components[]{
      "itemId": item->_id,
      "code": colorCode,
      "generalname": ${l10n("item->generalname")},
      "name": ${l10n("item->name")},
      "generalnameUk": item->generalname,
      "nameUk": item->name,
      "price": item->price,
      "priceDiscount": item->priceDiscount,
      "colorOpt": item->coloropts[code == ^.colorCode][0]{ ${l10nField("color")}, "colorUk": color }
    }
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
  "bundle": *[_type == "bundle" && slug == $slug && (${BUNDLE_AVAILABLE})][0] {
    ${BUNDLE_DETAIL_PROJECTION}
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

// Сет (bundle) у формі FeedProduct: один "колірний варіант" без кольору, id = "set-<slug>",
// фото сету, далі перше фото кожного компонента. Ціна — сума компонентів, знижка — ціна сету.
const FEED_BUNDLE_PROJECTION = `
  "id": _id,
  "generalname": "",
  "name": name,
  slug,
  description,
  "price": ${BUNDLE_REGULAR_PRICE},
  "priceDiscount": bundlePrice,
  "preorder": false,
  "preordertext": null,
  "outOfStock": coalesce(outOfStock, false),
  "cat": *[_type == "category" && ^._id in items[]._ref][0]{ "id": _id, name, slug },
  "coloropts": [{
    "code": "set-" + slug,
    "color": "",
    "photos": coalesce(photos[]{ ${FEED_IMAGE_PROJECTION} }, []) + array::compact(
      components[]{ "photo": item->coloropts[code == ^.colorCode][0].photos[0]{ ${FEED_IMAGE_PROJECTION} } }.photo
    )
  }]
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
// Фіди Meta, Rozetka і Google: лише позиції з showInFeed == true.
export const GET_FEED_PRODUCTS_QUERY = groq`
[
  ...*[
    _type == "item" &&
    defined(slug) &&
    defined(price) &&
    showonmain != true &&
    showInFeed == true
  ] {
    ${FEED_PRODUCT_PROJECTION}
  },
  ...*[
    _type == "bundle" &&
    defined(slug) &&
    showInFeed == true &&
    (${BUNDLE_AVAILABLE})
  ] {
    ${FEED_BUNDLE_PROJECTION}
  }
]
`;

// SEO block of a static page: a document with a fixed _id (seoHomePage, seoAboutPage, ...).
export const GET_SITE_SEO_QUERY = groq`
*[_id == $documentId][0] {
  "seo": seo{ ${SEO_PROJECTION} }
}
`;

// Title and SEO block of one category (much lighter than the full catalog query).
export const GET_CATEGORY_SEO_QUERY = groq`
{
  "category": *[_type == "category" && slug == $slug][0] {
    ${l10nField("name")},
    "seo": seo{ ${SEO_PROJECTION} }
  }
}
`;

// Everything the sitemap lists. A page is in the sitemap only when it really exists on the site:
// - every category, also an empty one (a "Sets" category while there is no available set);
// - a product under the category of its canonical URL /catalog/[category]/[product]: the one
//   whose list contains it, else the product's own category (the feeds link there). The "show
//   on main page" tiles are anchors, not pages, so they stay out;
// - a set only while it is available (the same rule as on its page).
export const GET_SITEMAP_DATA_QUERY = groq`
{
  "categories": *[_type == "category" && defined(slug)] {
    slug,
    "updatedAt": _updatedAt
  },
  "products": *[_type == "item" && defined(slug) && showonmain != true] {
    slug,
    "categorySlug": coalesce(
      *[_type == "category" && ^._id in items[]._ref][0].slug,
      cat->slug
    ),
    "updatedAt": _updatedAt
  }[defined(categorySlug)],
  "bundles": *[_type == "bundle" && defined(slug) && (${BUNDLE_AVAILABLE})] {
    slug,
    "categorySlug": *[_type == "category" && ^._id in items[]._ref][0].slug,
    "updatedAt": _updatedAt
  }[defined(categorySlug)],
  "pages": *[_id in $pageIds] {
    _id,
    "updatedAt": _updatedAt
  }
}
`;
