"use client";
import { useEffect, useState } from "react";

/**
 * iOS Safari / Instagram in-app browser bug:
 * коли ховається/показується панель браузера, `position: fixed; bottom: 0`
 * рахується відносно "layout viewport" (window.innerHeight), а не відносно
 * реально видимої частини екрана (window.visualViewport). Через це елемент
 * "втікає" під нижню панель браузера/іконку home indicator.
 *
 * Хук повертає, на скільки пікселів реально видима область менша за
 * layout viewport знизу — цю величину треба відняти (translateY) у фіксованого
 * елемента, щоб він завжди лишався видимим.
 */
export function useVisualViewportOffset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateOffset = () => {
      const layoutHeight = window.innerHeight;
      const visualBottom = viewport.height + viewport.offsetTop;
      const diff = layoutHeight - visualBottom;

      setOffset(diff > 0 ? Math.round(diff) : 0);
    };

    updateOffset();

    viewport.addEventListener("resize", updateOffset);
    viewport.addEventListener("scroll", updateOffset);
    window.addEventListener("orientationchange", updateOffset);

    return () => {
      viewport.removeEventListener("resize", updateOffset);
      viewport.removeEventListener("scroll", updateOffset);
      window.removeEventListener("orientationchange", updateOffset);
    };
  }, []);

  return offset;
}
