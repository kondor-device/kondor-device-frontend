import {
  LandingSection,
  LandingTextBlock,
  ProductLanding as ProductLandingData,
} from "@/types/productItem";
import LandingHero from "./LandingHero";
import LandingTextImage from "./LandingTextImage";
import LandingDarkOverlay from "./LandingDarkOverlay";
import LandingSquarePhoto from "./LandingSquarePhoto";
import LandingRibbon from "./LandingRibbon";
import LandingSteps from "./LandingSteps";
import LandingBanner from "./LandingBanner";
import LandingFaq from "./LandingFaq";
import { hasText } from "./utils";

interface ProductLandingProps {
  landing?: ProductLandingData | null;
}

// A block is shown only when something is filled in it
const hasTextBlock = (block: LandingTextBlock) =>
  hasText(block.title) || hasText(block.description) || Boolean(block.image);

function renderSection(section: LandingSection) {
  switch (section._type) {
    case "landingTextPhoto":
      return hasTextBlock(section) ? (
        <LandingTextImage
          key={section._key}
          block={section}
          framed={section.framed}
          badgesUnderImage={section.badgesUnderImage}
        />
      ) : null;
    case "landingDarkCard":
      return hasTextBlock(section) ? (
        <LandingDarkOverlay key={section._key} block={section} />
      ) : null;
    case "landingSquarePhoto":
      return hasTextBlock(section) ? (
        <LandingSquarePhoto key={section._key} block={section} />
      ) : null;
    case "landingRibbon":
      return (section.badges ?? []).some((item) => hasText(item.text)) ? (
        <LandingRibbon key={section._key} ribbon={section} />
      ) : null;
    case "landingSteps":
      return (section.items ?? []).length > 0 || section.image ? (
        <LandingSteps key={section._key} steps={section} />
      ) : null;
    case "landingBanner":
      return section.image ? (
        <LandingBanner
          key={section._key}
          banner={{ ...section, image: section.image }}
        />
      ) : null;
    case "landingFaq":
      return (section.items ?? []).length > 0 ? (
        <LandingFaq key={section._key} faq={section} />
      ) : null;
    // A block type the site does not know yet (e.g. added in the admin first) is skipped
    default:
      return null;
  }
}

// Blocks after the main content of the product page (filled in the admin)
export default function ProductLanding({ landing }: ProductLandingProps) {
  if (!landing) return null;

  const { hero, sections } = landing;

  const heroBlock = hero?.image ? (
    <LandingHero
      image={hero.image}
      mobileImage={hero.mobileImage}
      gradientColors={[
        hero.gradientColor1,
        hero.gradientColor2,
        hero.gradientColor3,
        hero.gradientColor4,
      ]}
      mobileGradientColors={[
        hero.mobileGradientColor1,
        hero.mobileGradientColor2,
        hero.mobileGradientColor3,
        hero.mobileGradientColor4,
      ]}
    />
  ) : null;

  const blocks = (sections ?? []).map(renderSection).filter(Boolean);

  if (!heroBlock && blocks.length === 0) return null;

  return (
    <div className="mb-5 tab:mb-[100px]">
      {/* The header is outside the padded container: its picture has the container's width
          and margins, but no side paddings */}
      {heroBlock}
      {blocks.length > 0 ? (
        <section className="container max-w-[1920px]">{blocks}</section>
      ) : null}
    </div>
  );
}
