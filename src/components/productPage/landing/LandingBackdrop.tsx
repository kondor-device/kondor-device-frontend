// A background layer as wide as the screen behind a block that stays inside the site container.
// The block needs `relative isolate`: the layer sits under its content.
// The same rounding as the other full-width blocks of the landing (the dark cards)
export const BACKDROP_ROUNDED =
  "rounded-[24px] tab:rounded-[40px] deskxl:rounded-[58px]";

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
      className={[
        "absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ background }}
    />
  );
}
