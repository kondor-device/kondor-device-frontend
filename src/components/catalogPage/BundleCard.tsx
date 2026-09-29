import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ProductItem } from "@/types/productItem";
import { formatSum } from "@/utils/formatSum";
import { getBundleSavings } from "@/utils/bundlePricing";

interface BundleCardProps {
  /** A catalog item with `kind: "bundle"` */
  product: ProductItem;
  className?: string;
}

// Card of a bundle (set) in the catalog lists. The set has a fixed content, so there is no color
// picker: the card shows what is included and links to the set page.
export default function BundleCard({
  product,
  className = "",
}: BundleCardProps) {
  const t = useTranslations();

  const {
    name,
    slug,
    categorySlug,
    price,
    priceDiscount,
    bundleComponents,
    bundlePhotos,
    outOfStock,
  } = product;
  // The set's own photo (added in the admin) goes first; without it the card shows the components
  const coverPhoto = bundlePhotos?.[0];
  const components = bundleComponents ?? [];
  const bundlePrice = priceDiscount ?? price;
  const { savingsPercent } = getBundleSavings(price, bundlePrice);

  const href = `/catalog/${categorySlug}/${slug}`;

  return (
    <div
      className={`flex flex-col justify-between p-3 desk:p-4 rounded-[8px] desk:rounded-[20px] shadow-catalogCard bg-surface min-h-full ${className}`}
    >
      <div className="relative rounded-[12px] aspect-square w-full mb-2 desk:mb-3 bg-white overflow-hidden">
        {savingsPercent > 0 ? (
          <div className="absolute z-10 top-0 desk:top-[14px] left-0 desk:left-[14px] shrink-0 w-fit py-[7px] px-2.5 desk:px-[14px] rounded-full border bg-white border-black text-black text-[10px] desk:text-[12px] font-semibold leading-[115%]">
            {t("bundle.economy")} {savingsPercent}%
          </div>
        ) : null}

        <Link
          href={href}
          className="flex items-center justify-center gap-1 size-full p-2 desk:p-4"
        >
          {coverPhoto ? (
            <Image
              src={coverPhoto.url}
              alt={coverPhoto.alt || name}
              width={540}
              height={540}
              className="max-w-full max-h-full object-contain laptop:hover:scale-105 transition duration-1000 ease-in-out"
            />
          ) : (
            components.map((component) => {
              const photo = component.colorOpt?.photos?.[0];

              return (
                <Image
                  key={`${component.itemId}-${component.code}`}
                  src={photo?.url || "/images/icons/logoSmall.svg"}
                  alt={
                    photo?.alt || `${component.generalname} ${component.name}`
                  }
                  width={540}
                  height={540}
                  className="min-w-0 flex-1 basis-0 max-h-full object-contain laptop:hover:scale-105 transition duration-1000 ease-in-out"
                />
              );
            })
          )}
        </Link>
      </div>

      <Link href={href} className="group block mb-3 desk:mb-4">
        <h3 className="text-12bold desk:text-18bold laptop:group-hover:brightness-125 focus-visible:brightness-125 active:brightness-125 active:scale-95 transition duration-300 ease-in-out">
          <span className="text-yellow">{name}</span>
        </h3>
      </Link>

      <ul className="flex flex-col gap-y-1 mb-3 desk:mb-4 text-10med desk:text-14med text-grey">
        {components.map((component) => (
          <li key={`${component.itemId}-${component.code}`}>
            {component.generalname} {component.name}
            {component.colorOpt?.color ? `, ${component.colorOpt.color}` : ""}
          </li>
        ))}
      </ul>

      <div>
        <div className="flex flex-col desk:flex-row desk:items-end gap-y-1 gap-x-[10px] mb-3 desk:mb-4">
          <p className="text-[18px] desk:text-[24px] font-bold uppercase leading-[105%]">
            {formatSum(bundlePrice)}
            {t("homePage.catalog.hrn")}
          </p>
          {savingsPercent > 0 ? (
            <p className="text-14bold desk:text-18bold text-grey uppercase line-through leading-[128%]">
              {formatSum(price)}
              {t("homePage.catalog.hrn")}
            </p>
          ) : null}
        </div>
        {outOfStock ? (
          <button
            type="button"
            disabled
            className="flex items-center justify-center w-full h-[33px] desk:h-9 px-3 text-9bold desk:text-12bold rounded-full outline-none bg-grey text-white cursor-not-allowed"
          >
            {t("buttons.outOfStock")}
          </button>
        ) : (
          <Link
            href={href}
            className="flex items-center justify-center w-full h-[33px] desk:h-9 px-3 text-9bold desk:text-12bold rounded-full transition duration-300 ease-out active:scale-95 outline-none text-dark bg-yellowGradient active:brightness-[115%] desk:hover:brightness-[115%] focus-visible:brightness-[115%]"
          >
            {t("bundle.details")}
          </Link>
        )}
      </div>
    </div>
  );
}
