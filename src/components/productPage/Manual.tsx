import { ProductItem } from "@/types/productItem";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ManualProps {
  product: ProductItem;
}

export default function Manual({ product }: ManualProps) {
  const t = useTranslations("productPage");

  const manual = product?.manual;
  const driver = product?.driver;

  if (!manual && !driver) return null;

  return (
    <div className="flex flex-col tab:flex-row tab:gap-8 gap-4 container max-w-[1920px]">
      {manual ? (
        <div className="tab:w-[calc(50%-16px)] p-5 desk:py-10 desk:px-[50px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard">
          <a
            href={manual}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group flex justify-between items-center w-full"
          >
            <span className="text-16semi desk:text-24bold"> {t("manual")}</span>
            <Image
              src="/images/icons/link.svg"
              width={24}
              height={24}
              alt="link icon"
              className="w-6 desk:w-8 h-auto laptop:group-hover:brightness-125 transition duration-300 ease-in-out"
            />
          </a>
        </div>
      ) : null}
      {driver ? (
        <div className="tab:w-[calc(50%-16px)] p-5 desk:py-10 desk:px-[50px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard">
          <a
            href={driver}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group flex justify-between items-center w-full"
          >
            <span className="text-16semi desk:text-24bold"> {t("driver")}</span>
            <Image
              src="/images/icons/link.svg"
              unoptimized
              width={24}
              height={24}
              alt="link icon"
              className="w-6 desk:w-8 h-auto laptop:group-hover:brightness-125 transition duration-300 ease-in-out"
            />
          </a>
        </div>
      ) : null}
    </div>
  );
}
