interface SparklesProps {
  color: string;
}

// Three stars above a section title. The shape is the file from the design, painted with the
// accent colour of the section through a mask.
export default function Sparkles({ color }: SparklesProps) {
  const mask = "url(/images/landing/sparkles.svg) no-repeat center / contain";

  return (
    <span
      aria-hidden="true"
      className="block w-[80px] tab:w-[96px] deskxl:w-[112.639px] aspect-[112.639/28.0852]"
      style={{ backgroundColor: color, mask, WebkitMask: mask }}
    />
  );
}
