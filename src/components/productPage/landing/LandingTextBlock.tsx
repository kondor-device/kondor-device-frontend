import { LandingTextBlock as TextBlock } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import Sparkles from "./Sparkles";
import { FALLBACK_COLOR, hasText } from "./utils";

interface LandingTextBlockProps {
  block: TextBlock;
  /** Background of the section: the template alternates white and dark blocks */
  theme: "light" | "dark";
  imageSide: "left" | "right";
}

export default function LandingTextBlock({
  block,
  theme,
  imageSide,
}: LandingTextBlockProps) {
  const badges = (block.badges ?? []).filter((item) => hasText(item.text));
  const accent = block.accentColor ?? FALLBACK_COLOR;

  return (
    <div
      className={[
        "p-5 tab:p-10 desk:py-[60px] desk:px-[100px]",
        theme === "dark" ? "bg-[#0B0B10] text-white" : "bg-white text-dark",
      ].join(" ")}
    >
      <div className="grid tab:grid-cols-2 items-center gap-6 tab:gap-10">
        <div className={imageSide === "left" ? "tab:order-2" : undefined}>
          <Sparkles color={block.accentColor} />
          {hasText(block.title) ? (
            <h2 className="mt-3 text-18bold tab:text-24bold desk:text-32bold uppercase">
              {block.title}
            </h2>
          ) : null}
          {hasText(block.description) ? (
            <p className="mt-3 tab:mt-4 text-12med tab:text-14med desk:text-16med opacity-70 whitespace-pre-line">
              {block.description}
            </p>
          ) : null}
          {badges.length > 0 ? (
            <ul className="mt-5 tab:mt-8 flex flex-wrap gap-2">
              {badges.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-1.5 rounded-full text-white text-10bold tab:text-12bold"
                  style={{ backgroundColor: accent }}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {block.image ? (
          <div className={imageSide === "left" ? "tab:order-1" : undefined}>
            <LandingPicture
              image={block.image}
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
