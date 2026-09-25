import { ColorOpt } from "@/types/productItem";

// The color in a product URL is identified by its code, which is the same in every language
// (the displayed color name is localized).
export const getColorParam = (colorOpt?: ColorOpt) =>
  encodeURIComponent(colorOpt?.code ?? "");

// Also understands legacy links where the param was the lowercased color name
export const findColorIndex = (coloropts: ColorOpt[], param: string | null) => {
  if (!param) return -1;

  const normalized = param.toLowerCase();

  return coloropts.findIndex(
    (opt) =>
      opt.code === param ||
      opt.code?.toLowerCase() === normalized ||
      opt.color?.toLowerCase() === normalized
  );
};
