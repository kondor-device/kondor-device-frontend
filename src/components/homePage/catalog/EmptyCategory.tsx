import { useTranslations } from "next-intl";

interface EmptyCategoryProps {
  className?: string;
}

export default function EmptyCategory({ className = "" }: EmptyCategoryProps) {
  const t = useTranslations("homePage.catalog");

  return (
    <div
      className={`container w-full max-w-[1920px] pb-5 laptop:pt-5 laptop:pb-[40px] ${className}`}
    >
      <p className="text-12med laptop:text-18med text-center text-grey">
        {t("noProducts")}
      </p>
    </div>
  );
}
