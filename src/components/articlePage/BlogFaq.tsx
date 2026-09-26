import { PortableText } from "@portabletext/react";
import { getTranslations } from "next-intl/server";
import JsonLd from "../shared/JsonLd";
import { BlogFaqItem } from "@/types/blog";
import { portableTextToPlain } from "@/utils/portableTextToPlain";
import FaqAccordion from "./FaqAccordion";
import { blogPortableTextComponents } from "./portableText/blogPortableTextComponents";

interface BlogFaqProps {
  items: BlogFaqItem[];
}

export default async function BlogFaq({ items }: BlogFaqProps) {
  const t = await getTranslations("blogPage");

  if (!items?.length) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: portableTextToPlain(answer),
      },
    })),
  };

  return (
    <section className="mt-10 laptop:mt-16">
      <JsonLd data={faqSchema} />
      <h2 className="mb-5 laptop:mb-8 text-22bold laptop:text-32bold">
        {t("faqTitle")}
      </h2>
      <FaqAccordion
        items={items.map(({ _key, question, answer }) => ({
          id: _key,
          question,
          answer: (
            <PortableText
              value={answer}
              components={blogPortableTextComponents}
            />
          ),
        }))}
      />
    </section>
  );
}
