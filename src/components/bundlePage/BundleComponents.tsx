import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { BundleComponent } from "@/types/bundle";
import { formatSum } from "@/utils/formatSum";
import { getActualPrice } from "@/utils/bundlePricing";
import { getColorParam } from "@/utils/colorParam";

interface BundleComponentsProps {
  components: BundleComponent[];
}

// What the set consists of: 2–3 products, each in one fixed color (it cannot be changed here).
export default async function BundleComponents({
  components,
}: BundleComponentsProps) {
  const t = await getTranslations();

  return (
    <div className="mb-5 desk:mb-9">
      <h2 className="mb-3 desk:mb-5 text-14bold desk:text-24bold">
        {t("bundle.contents")}
      </h2>
      <ul className="flex flex-col gap-y-3">
        {components.map((component) => {
          const { colorOpt, categorySlug, slug } = component;
          const photo = colorOpt?.photos?.[0];
          const title = `${component.generalname} ${component.name}`.trim();
          const href = categorySlug
            ? `/catalog/${categorySlug}/${slug}?color=${getColorParam(colorOpt)}`
            : null;

          const content = (
            <>
              <div className="shrink-0 size-[72px] desk:size-[96px] rounded-[8px] bg-white overflow-hidden">
                <Image
                  src={photo?.url || "/images/icons/logoSmall.svg"}
                  alt={photo?.alt || title}
                  width={192}
                  height={192}
                  className="size-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-y-1.5 min-w-0">
                <p className="text-12bold desk:text-18bold">
                  <span>{component.generalname}</span>{" "}
                  <span className="text-yellow">{component.name}</span>
                </p>
                <p className="flex items-center gap-x-2 text-12med desk:text-16med">
                  {colorOpt?.colorset?.hex ? (
                    <span
                      aria-hidden
                      className="shrink-0 size-4 rounded-full border border-fg"
                      style={{ backgroundColor: colorOpt.colorset.hex }}
                    />
                  ) : null}
                  <span>
                    {t("bundle.color")}
                    {colorOpt?.color}
                  </span>
                </p>
              </div>
              <p className="ml-auto pl-2 shrink-0 text-12med desk:text-16med text-grey">
                {formatSum(getActualPrice(component))}
                {t("homePage.catalog.hrn")}
              </p>
            </>
          );

          return (
            <li key={`${component.itemId}-${component.code}`}>
              {href ? (
                <Link
                  href={href}
                  className="flex items-center gap-x-3 desk:gap-x-4 p-3 rounded-[12px] bg-surface shadow-catalogCard laptop:hover:brightness-110 transition duration-300 ease-in-out"
                >
                  {content}
                </Link>
              ) : (
                <div className="flex items-center gap-x-3 desk:gap-x-4 p-3 rounded-[12px] bg-surface shadow-catalogCard">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-10med desk:text-14med text-grey">
        {t("bundle.fixedColors")}
      </p>
    </div>
  );
}
