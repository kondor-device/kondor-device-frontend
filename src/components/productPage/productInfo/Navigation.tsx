"use client";
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { ProductItem } from "@/types/productItem";
import { useTranslations } from "next-intl";
import { Tabs, Tab } from "@heroui/react";

interface NavigationProps {
  product: ProductItem;
  /** Rendered above the (fixed) tab row, in normal document flow. Its
   * measured height is fed into the tab row's fixed `top` offset below,
   * so the two never overlap regardless of how many lines the breadcrumb
   * trail wraps to. */
  breadcrumbs?: ReactNode;
}

type NavigationItem = { title: string; slug: string };

export default function Navigation({ product, breadcrumbs }: NavigationProps) {
  const [selected, setSelected] = useState("all");
  const isManuallySelecting = useRef(false);
  const tabListRef = useRef<HTMLDivElement>(null);
  const breadcrumbsRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [breadcrumbsHeight, setBreadcrumbsHeight] = useState(0);

  useEffect(() => {
    const el = breadcrumbsRef.current;
    if (!el) {
      setBreadcrumbsHeight(0);
      return;
    }

    const updateHeight = () => setBreadcrumbsHeight(el.offsetHeight);
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [breadcrumbs]);

  // Таби фіксовані, але спочатку їдуть разом зі сторінкою: їхній top —
  // це природна позиція плейсхолдера (--nat-top), і лише коли вона піднімається
  // вище за низ хедера, CSS max() притискає їх під хедер.
  useEffect(() => {
    const placeholder = placeholderRef.current;
    const tabList = tabListRef.current;
    if (!placeholder || !tabList) return;

    const update = () => {
      tabList.style.setProperty(
        "--nat-top",
        `${placeholder.getBoundingClientRect().top}px`
      );
    };
    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [breadcrumbsHeight]);

  const t = useTranslations("productPage.navigation");

  const { description, complect, chars, video, manual, driver } = product;

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
    manual && { title: t("manual"), slug: "manual" },
    driver && { title: t("driver"), slug: "driver" },
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

  // Автоскрол лише всередині рядка табів — без scrollIntoView,
  // бо він на iOS зсуває всю сторінку по горизонталі.
  useEffect(() => {
    const tabList = tabListRef.current;
    if (!tabList) return;

    const activeTab = tabList.querySelector<HTMLElement>(
      '[role="tab"][aria-selected="true"]'
    );
    if (!activeTab) return;

    const nextLeft =
      activeTab.offsetLeft -
      tabList.clientWidth / 2 +
      activeTab.clientWidth / 2;

    tabList.scrollTo({
      left: Math.max(0, nextLeft),
      behavior: "smooth",
    });
  }, [selected]);

  return (
    <div
      className="relative mb-8"
      style={
        { "--breadcrumbs-h": `${breadcrumbsHeight}px` } as CSSProperties
      }
    >
      {breadcrumbs && <div ref={breadcrumbsRef}>{breadcrumbs}</div>}
      {/* Резервує місце в нормальному потоці під фіксовану панель табів
          нижче — та сама висота 43px + той самий відступ, що і в top
          фіксованої панелі, інакше контент під нею "підстрибне" вгору. */}
      <div ref={placeholderRef} className="overflow-x-auto h-[calc(43px+12px)] tab:h-[calc(43px+24px)] bg-surface dark:bg-dark">
        <div
          ref={tabListRef}
          // top = max(природна позиція + відступ під крихтами (12px, 24px від 768px —
          // той самий, що в висоті плейсхолдера), низ хедера).
          // Фолбек — до першого виміру.
          className="fixed z-30 top-[max(calc(var(--nat-top,calc(56px+var(--breadcrumbs-h)))+12px),56px)] tab:top-[max(calc(var(--nat-top,calc(56px+var(--breadcrumbs-h)))+24px),56px)] tabxl:top-[max(calc(var(--nat-top,calc(109px+var(--breadcrumbs-h)))+24px),109px)] left-0 tabxl:container tabxl:max-w-[1920px] pt-1.5 pb-0.5 w-full rounded-b-[12px] bg-surface dark:bg-dark
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
            base: "bg-surface dark:bg-dark",
            tabList: "bg-surface dark:bg-dark",
            cursor:
              "bg-yellow dark:bg-yellow py-1.5 tabxl:py-2 px-4 tabxl:px-[22.5px] rounded-[12px] tabxl:rounded-full",
            tab: "py-1.5 tabxl:py-2 px-4 tabxl:px-[22.5px] w-fit",
            tabContent: "group-data-[selected=true]:text-dark text-12med tabxl:text-14med desk:text-18med",
          }}
        >
          {navigationList.map((navigationItem) => (
            <Tab key={navigationItem.slug} title={navigationItem.title} />
          ))}
        </Tabs>
        </div>
      </div>
    </div>
  );
}
