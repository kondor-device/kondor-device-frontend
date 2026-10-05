import { ProductLanding } from "@/types/productItem";
import LandingPicture from "./LandingPicture";
import { hasText } from "./utils";

type Steps = NonNullable<ProductLanding["steps"]>;

export default function LandingSteps({ steps }: { steps: Steps }) {
  const items = (steps.items ?? []).filter(
    (item) => hasText(item.title) || hasText(item.description),
  );

  return (
    <div className="p-5 tab:p-10 desk:py-[60px] desk:px-[100px] bg-white text-dark">
      <div className="grid tab:grid-cols-2 items-center gap-6 tab:gap-10">
        <ol className="flex flex-col gap-5 tab:gap-8">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-4">
              <span className="shrink-0 flex items-center justify-center size-8 tab:size-10 rounded-full bg-dark text-white text-14bold tab:text-18bold">
                {index + 1}
              </span>
              <div>
                {hasText(item.title) ? (
                  <h3 className="text-14bold tab:text-18bold uppercase">
                    {item.title}
                  </h3>
                ) : null}
                {hasText(item.description) ? (
                  <p className="mt-1 text-12med tab:text-14med opacity-70 whitespace-pre-line">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        {steps.image ? (
          <LandingPicture
            image={steps.image}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : null}
      </div>
    </div>
  );
}
