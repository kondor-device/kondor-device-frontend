"use client";
import { useEffect, useState } from "react";
import { ProductItem } from "@/types/productItem";
import { useTranslations } from "next-intl";

interface NavigationProps {
  product: ProductItem;
}

type NavigationItem = { title: string; slug: string };

export default function Navigation({ product }: NavigationProps) {
  const [hash, setHash] = useState("");
  const t = useTranslations("productPage.navigation");

  const { description, complect, chars, video, slug } = product;

  const navigationList = [
    { title: t("allAboutProduct"), slug: "#all" },
    description && { title: t("description"), slug: "#description" },
    chars && { title: t("characteristics"), slug: "#characteristics" },
    video && { title: t("see"), slug: "#video" },
    complect && { title: t("complect"), slug: "#complect" },
  ].filter(Boolean) as NavigationItem[];

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <ul
      className="flex items-center gap-x-5 mb-8 overflow-x-auto py-2 scrollbar 
      scrollbar-h-[2px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-yellow 
      scrollbar-track-transparent"
    >
      {navigationList.map((navigationItem, idx) => (
        <li key={idx} className="shrink-0">
          <a
            href={`/catalog/${slug}${navigationItem?.slug}`}
            className={`flex justify-center items-center w-full h-full py-[6px] px-4 desk:py-2 desk:px-[22px] rounded-full text-[12px] desk:text-[18px] font-medium leading-none  ${
              hash === navigationItem?.slug
                ? "bg-[linear-gradient(115deg,_#FFCC54_10.87%,_#FFB300_81.45%)]"
                : hash === "" && navigationItem?.slug === "#all"
                ? "bg-[linear-gradient(115deg,_#FFCC54_10.87%,_#FFB300_81.45%)]"
                : ""
            }`}
          >
            {navigationItem?.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
