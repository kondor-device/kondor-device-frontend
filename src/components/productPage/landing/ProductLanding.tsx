import { ProductLanding as ProductLandingData } from "@/types/productItem";
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

type TextBlockData = ProductLandingData["textBlock1"];

// A section is shown only when something is filled in it
const hasTextBlock = (block: TextBlockData) =>
  Boolean(block && (hasText(block.title) || hasText(block.description) || block.image));

// Sections after the main content of the product page (filled in the admin)
export default function ProductLanding({ landing }: ProductLandingProps) {
  if (!landing) return null;

  const {
    hero,
    textBlock1,
    textBlock2,
    ribbon,
    steps,
    banner,
    textBlock3,
    textBlock4,
    faq,
  } = landing;

  const sections = [
    hero && (hasText(hero.model) || hero.image) ? (
      <LandingHero key="hero" hero={hero} />
    ) : null,
    hasTextBlock(textBlock1) ? (
      <LandingTextImage key="block1" block={textBlock1!} badgesUnderImage />
    ) : null,
    hasTextBlock(textBlock2) ? (
      <LandingDarkOverlay key="block2" block={textBlock2!} />
    ) : null,
    ribbon && (ribbon.badges ?? []).some((item) => hasText(item.text)) ? (
      <LandingRibbon key="ribbon" ribbon={ribbon} />
    ) : null,
    steps && ((steps.items ?? []).length > 0 || steps.image) ? (
      <LandingSteps key="steps" steps={steps} />
    ) : null,
    banner?.image ? <LandingBanner key="banner" image={banner.image} /> : null,
    hasTextBlock(textBlock3) ? (
      <LandingSquarePhoto key="block3" block={textBlock3!} />
    ) : null,
    hasTextBlock(textBlock4) ? (
      <LandingTextImage key="block4" block={textBlock4!} framed />
    ) : null,
    faq && (faq.items ?? []).length > 0 ? <LandingFaq key="faq" faq={faq} /> : null,
  ].filter(Boolean);

  if (sections.length === 0) return null;

  return (
    <section className="mt-10 desk:mt-[60px] overflow-hidden bg-white">
      {sections}
    </section>
  );
}
