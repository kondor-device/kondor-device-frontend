"use client";
import { useEffect, useRef, useState } from "react";
import { ProductItem } from "@/types/productItem";
import { useTranslations } from "next-intl";
import { Tabs, Tab } from "@heroui/react";

interface NavigationProps {
  product: ProductItem;
}

type NavigationItem = { title: string; slug: string };

export default function Navigation({ product }: NavigationProps) {
  const [selected, setSelected] = useState("all");
  const isManuallySelecting = useRef(false);
  const tabListRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("productPage.navigation");

  const { description, complect, chars, video } = product;

  const handleTabChange = (key: string) => {
    isManuallySelecting.current = true; // ← блокуємо автооновлення
    setSelected(key);
    const el = document.getElementById(key);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Відновимо через таймер
    setTimeout(() => {
      isManuallySelecting.current = false;
    }, 1000); // 1 сек — достатньо для scrollIntoView завершитись
  };

  const navigationList = [
    { title: t("allAboutProduct"), slug: "all" },
    description && { title: t("description"), slug: "description" },
    chars && { title: t("characteristics"), slug: "characteristics" },
    video && { title: t("see"), slug: "video" },
    complect && { title: t("complect"), slug: "complect" },
  ].filter(Boolean) as NavigationItem[];

  useEffect(() => {
    const handleScroll = () => {
      if (isManuallySelecting.current) return;

      const vh = window.innerHeight;
      const start = vh * 0.1;
      const end = vh * 0.4;
      let active = selected;

      for (const item of navigationList) {
        const el = document.getElementById(item.slug);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top >= start && top <= end) {
          active = item.slug;
          break;
        }
      }

      if (active !== selected) setSelected(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navigationList, selected]);

  // Автоскрол табів
  useEffect(() => {
    const tabList = tabListRef.current;
    if (!tabList) return;

    const activeTab = tabList.querySelector<HTMLElement>(
      '[role="tab"][aria-selected="true"]'
    );
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selected]);

  return (
    <div className="relative mb-8 overflow-x-auto h-[43px] bg-white">
      <div
        ref={tabListRef}
        className="fixed z-30 top-[56px] tabxl:top-[109px] left-0 tabxl:container tabxl:max-w-[1920px] pt-1.5 pb-0.5 w-full rounded-b-[12px] bg-white
       shadow-catalogFilter tabxl:shadow-none  overflow-x-auto scrollbar 
      scrollbar-h-0 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-transparent 
      scrollbar-track-transparent"
      >
        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => handleTabChange(key as string)}
          aria-label="Scroll nav"
          radius="none"
          size="lg"
          classNames={{
            base: "bg-white",
            tabList: "bg-white",
            cursor:
              "bg-yellow py-1.5 tabxl:py-2 px-4 tabxl:px-[22.5px] rounded-[12px] tabxl:rounded-full",
            tab: "py-1.5 tabxl:py-2 px-4 tabxl:px-[22.5px] w-fit",
            tabContent: "text-12med tabxl:text-14med desk:text-18med",
          }}
        >
          {navigationList.map((navigationItem) => (
            <Tab key={navigationItem.slug} title={navigationItem.title} />
          ))}
        </Tabs>
      </div>
    </div>
  );
}
