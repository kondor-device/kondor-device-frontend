// The same rounding as the other full-width blocks of the landing (the dark cards)
export const BACKDROP_ROUNDED =
  "rounded-[24px] tab:rounded-[40px] deskxl:rounded-[58px]";

// A background layer over the whole block. The block is as wide as the page (it is not inside the
// site container) and needs `relative isolate`: the layer sits under its content.
export default function LandingBackdrop({
  background,
  className,
}: {
  background: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={["absolute inset-0 -z-10", className]
        .filter(Boolean)
        .join(" ")}
      style={{ background }}
    />
  );
}
