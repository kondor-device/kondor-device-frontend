import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Bundle } from "@/types/bundle";
import ImagePicker from "@/components/productPage/productInfo/ImagePicker";
import { formatSum } from "@/utils/formatSum";
import { getBundlePhotos } from "@/utils/bundlePhotos";
import { getBundleSavings, getRegularPrice } from "@/utils/bundlePricing";
import BundleComponents from "./BundleComponents";
import BundleBuyButton from "./BundleBuyButton";
import { ProductItem } from "@/types/productItem";

interface BundleInfoProps {
  bundle: Bundle;
  /** Accessories offered in the cart pop-up */
  addons: ProductItem[];
  breadcrumbs?: ReactNode;
}

const LOGO = { url: "/images/icons/logoSmall.svg", alt: "" };

// Page of a bundle (set): what it consists of, its price and the saving against buying separately.
export default async function BundleInfo({
  bundle,
  addons,
  breadcrumbs,
}: BundleInfoProps) {
  const t = await getTranslations();

  const { name, description, bundlePrice, components } = bundle;

  const { regularPrice, savingsUah, savingsPercent } = getBundleSavings(
    getRegularPrice(components),
    bundlePrice,
  );

  // The set's own photos first, then the components' photos
  const photos = getBundlePhotos(bundle.photos, components);

  const hrn = t("homePage.catalog.hrn");

  return (
    <section className="mb-8 desk:mb-[69px]">
      {breadcrumbs}
      <div className="container max-w-[1920px] mt-6">
        {/* On desktop: gallery and description in the left column, the rest on the right. The
            gallery's slides stick out of its box by 30px (thumbnails on the left), so the
            description is 30px wider than the column to match what is seen.
            The two columns are equal (as the flex layout of the product page); the second row
            takes the extra height, so the description sits right under the gallery. */}
        <div className="tabxl:grid tabxl:grid-cols-2 tabxl:grid-rows-[auto_1fr] tabxl:items-start gap-x-[80px] desk:gap-x-[120px] w-full mb-5 tab:mb-[100px]">
          <ImagePicker
            photos={photos.length > 0 ? photos : [LOGO]}
            fillColumn
          />
          <div className="tabxl:col-start-2 tabxl:row-start-1 tabxl:row-span-2">
            <p className="mb-2 desk:mb-3 text-12bold desk:text-18bold uppercase text-yellow">
              {t("bundle.label")}
            </p>
            <h1 className="mb-5 desk:mb-9 text-[24px] font-medium leading-[110%] desk:text-[45px]">
              {name}
            </h1>

            <BundleComponents components={components} />

            {savingsUah > 0 ? (
              <p className="inline-flex w-fit mb-3 desk:mb-4 py-2 px-4 rounded-full border border-yellow text-14bold desk:text-18bold text-yellow">
                {t("bundle.economy")} {savingsPercent}% ·{" "}
                {formatSum(savingsUah)}
                {hrn}
              </p>
            ) : null}
            <div className="flex flex-row flex-wrap items-end gap-x-6 gap-y-2 mb-0">
              <p className="text-[40px] desk:text-[54px] font-bold uppercase leading-none">
                {formatSum(bundlePrice)}
                {hrn}
              </p>
              {savingsUah > 0 ? (
                <p className="text-[16px] desk:text-[22px] text-grey uppercase line-through font-bold leading-[150%]">
                  {formatSum(regularPrice)}
                  {hrn}
                </p>
              ) : null}
            </div>
            <BundleBuyButton bundle={bundle} addons={addons} />
          </div>
          {description ? (
            <div className="tabxl:col-start-1 tabxl:row-start-2 tabxl:w-[min(calc(100%+30px),647px)] mb-4 tab:mb-8 tabxl:mb-0 tabxl:mt-10 p-5 desk:py-[56px] desk:px-[76px] bg-surface rounded-[20px] desk:rounded-[30px] shadow-catalogCard">
              <p className="mb-5 text-14bold desk:text-24bold">
                {t("productPage.description")}
              </p>
              <p className="whitespace-pre-line text-12med desk:text-18med">
                {description}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
