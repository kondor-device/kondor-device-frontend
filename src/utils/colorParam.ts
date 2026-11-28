import { ColorOpt } from "@/types/productItem";

// The color in a product URL is identified by its code, which is the same in every language
// (the displayed color name is localized). A code typed into the admin with a stray space
// around it used to end up in the link as "?color=1035%20".
export const getColorParam = (colorOpt?: ColorOpt) =>
  encodeURIComponent(colorOpt?.code?.trim() ?? "");

// Also understands legacy links where the param was the lowercased color name, and links
// written before the code was trimmed (with or without the stray space)
export const findColorIndex = (coloropts: ColorOpt[], param: string | null) => {
  if (!param) return -1;

  const trimmed = param.trim();
  const normalized = trimmed.toLowerCase();

  return coloropts.findIndex((opt) => {
    const code = opt.code?.trim();
    return (
      code === trimmed ||
      code?.toLowerCase() === normalized ||
      opt.color?.trim().toLowerCase() === normalized
    );
  });
};

// Link to a product page from a card. The product page opens with the first color when the
// address has no ?color=, so the first color gets the clean address (the canonical one, the
// same as in the sitemap); any other color is passed in ?color=.
export const getProductHref = (
  categorySlug: string | undefined,
  slug: string,
  coloropts: ColorOpt[],
  selectedColorIndex: number,
) => {
  const path = `/catalog/${categorySlug}/${slug}`;
  const colorOpt = selectedColorIndex > 0 ? coloropts[selectedColorIndex] : undefined;

  return colorOpt ? `${path}?color=${getColorParam(colorOpt)}` : path;
};
