import { groq } from "next-sanity";

const IMAGE_PROJECTION = `"alt": coalesce(alt, ""), "url": asset->url`;

const BADGE_PROJECTION = `
  "badge": badge->{
    text,
    "backgroundColor": select(defined(backgroundColor.hex) => { "hex": backgroundColor.hex })
  }
`;

export const COLOR_OPTIONS_PROJECTION = `
  code,
  color,
  "colorset": {
    "hex": coalesce(colorset.hex.hex, colorset.hex)
  },
  "photos": photos[]{${IMAGE_PROJECTION}}
`;

const COMPLECT_PROJECTION = `
  name,
  "icon": icon{ ${IMAGE_PROJECTION} }
`;

const CHARS_PROJECTION = `name, char`;

const CATEGORY_PROJECTION = `
  "id": _id,
  name,
  pos,
  slug,
  "image": image{ ${IMAGE_PROJECTION} },
  "items": items[]->{
    "id": _id,
    generalname,
    name,
    slug,
    price,
    priceDiscount,
    showonaddons,
    showonmain,
    ${BADGE_PROJECTION},
    preorder,
    preordertext,
    "chars": chars[]{ ${CHARS_PROJECTION} },
    "coloropts": coloropts[]{ ${COLOR_OPTIONS_PROJECTION} },
    "complect": complect[]{ ${COMPLECT_PROJECTION} }
  }
`;

const ADDONS_PROJECTION = `
  "id": _id,
  preorder,
  preordertext,
  "coloropts": coloropts[]{
    color,
    code,
    "photos": photos[]{ ${IMAGE_PROJECTION} }
  },
  generalname,
  name,
  price,
  priceDiscount,
  ${BADGE_PROJECTION}
`;

const MAIN_PRODUCTS_PROJECTION = `
  "id": _id,
  name,
  slug,
  price,
  priceDiscount,
  "cat": cat->{ "id": _id, name },
  "coloropts": coloropts[]{
    "photos": photos[]{ ${IMAGE_PROJECTION} }
  },
  ${BADGE_PROJECTION}
`;

const ITEM_DETAIL_PROJECTION = `
  "id": _id,
  generalname,
  name,
  seoTitle,
  seoDescription,
  "seoImage": select(defined(seoImage.asset->url) => { "url": seoImage.asset->url }),
  slug,
  price,
  priceDiscount,
  description,
  manual,
  driver,
  "video": select(defined(video.url) => { "url": video.url }),
  newItem,
  showonaddons,
  showonmain,
  ${BADGE_PROJECTION},
  preorder,
  preordertext,
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
    priceDiscount
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
