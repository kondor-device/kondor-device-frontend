import React from "react";
import FooterSubTitle from "./FooterSubTitle";
import { useTranslations } from "next-intl";
import FooterNavItem from "./FooterNavItem";
import { CategoryItem } from "@/types/categoryItem";

interface ImportantProps {
  categories: CategoryItem[];
}

export default function Important({ categories }: ImportantProps) {
  const t = useTranslations();

  const categoriesList = categories
    ? categories
        .sort((a, b) => a.pos - b.pos)
        .map((category) => ({
          title: category.name,
          category: category.slug,
        }))
    : [];

  const allCategoriesSlugs = categoriesList.map((c) => c.category).join(",");

  const importantList = [
    { title: t("footer.important.list.home"), path: "/" },
    {
      title: t("footer.important.list.catalog"),
      path: `/catalog?type=${allCategoriesSlugs}`,
    },
    { title: t("footer.important.list.delivery"), path: "/delivery" },
    { title: t("footer.important.list.about"), path: "/about" },
  ];

  return (
    <div>
      <FooterSubTitle>{t("footer.important.title")}</FooterSubTitle>
      <ul className="flex flex-col gap-y-[10px] laptop:gap-y-[15px]">
        {importantList.map((importantItem, idx) => (
          <FooterNavItem key={idx} navItem={importantItem} />
        ))}
      </ul>
    </div>
  );
}
