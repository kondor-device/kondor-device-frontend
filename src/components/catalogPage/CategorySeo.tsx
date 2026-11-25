import { getTranslations } from "next-intl/server";

/**
 * Visible heading and SEO text of the catalog pages (/catalog and /catalog/[category]).
 * Texts live in messages/*.json under `categorySeo.pages.<key>`, where the key is the
 * category slug or "catalog". They do not mention prices: prices change often.
 * A category without texts (e.g. one added later in Sanity) gets its name as the heading
 * and no text.
 */

interface CategorySeoSection {
  title: string;
  text: string[];
}

interface CategorySeoContent {
  h1: string;
  intro?: string;
  sections?: CategorySeoSection[];
}

async function getCategorySeo(
  pageKey: string,
): Promise<CategorySeoContent | undefined> {
  const t = await getTranslations("categorySeo");
  const pages = t.raw("pages") as Record<string, CategorySeoContent>;

  return pages?.[pageKey];
}

interface CategoryHeadingProps {
  /** Category slug, or "catalog" for the shared catalog page */
  pageKey: string;
  /** Used when there are no texts for this page */
  fallbackTitle: string;
}

export async function CategoryHeading({
  pageKey,
  fallbackTitle,
}: CategoryHeadingProps) {
  const content = await getCategorySeo(pageKey);

  return (
    <div className="container w-full max-w-[1920px] pt-4 laptop:pt-6">
      <h1 className="text-22bold laptop:text-40bold">
        {content?.h1 || fallbackTitle}
      </h1>
      {content?.intro && (
        <p className="mt-2 laptop:mt-3 max-w-[960px] text-12med laptop:text-16med text-fg/70">
          {content.intro}
        </p>
      )}
    </div>
  );
}

export async function CategorySeoText({ pageKey }: { pageKey: string }) {
  const content = await getCategorySeo(pageKey);
  const sections = content?.sections ?? [];

  if (sections.length === 0) return null;

  return (
    <section className="container max-w-[1920px] pb-8 laptop:pb-[100px]">
      <div className="flex flex-col gap-y-6 laptop:gap-y-10 max-w-[960px] pt-6 laptop:pt-10 border-t border-fg/20">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-y-2 laptop:gap-y-3">
            <h2 className="text-16bold laptop:text-24bold">{section.title}</h2>
            {section.text.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-12reg laptop:text-18reg text-fg/80"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
