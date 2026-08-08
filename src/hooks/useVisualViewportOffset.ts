"use client";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const IDLE_DELAY_MS = 250;

/**
 * Баг стосується виключно iOS (WebKit): у Safari/Instagram/Facebook на iPhone
 * "layout viewport" (window.innerHeight) НЕ змінюється, коли ховається/з'являється
 * панель браузера — змінюється лише "visual viewport" (window.visualViewport).
 * Через це `position: fixed; bottom: 0` рахується відносно значення, яке вже не
 * відповідає реально видимій області, і елемент "втікає" під панель браузера.
 *
 * На Android (Chrome тощо) такого бага немає: там layout viewport сам
 * підлаштовується під видиму область, тому нативний `fixed bottom: 0` вже працює
 * коректно. Якщо застосувати цю ж компенсацію на Android, під час анімованого
 * ховання панелі innerHeight і visualViewport.height оновлюються не синхронно —
 * виникає хибна тимчасова різниця, і кнопка помітно "підстрибує вгору, а потім
 * падає вниз". Тому хук вмикається лише на iOS-пристроях.
 */
function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  const isAppleMobile = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ маскується під "MacIntel", але має сенсорний екран
  const isIPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return isAppleMobile || isIPadOS;
}

/**
 * Хук напряму (через ref, в обхід React state/re-render) компенсує різницю між
 * layout viewport і visual viewport через `translateY`, щоб фіксований елемент
 * завжди лишався видимим на iOS. На інших платформах нічого не робить.
 *
 * Поки триває скрол/дотик, значення перераховується щокадрово через
 * requestAnimationFrame (події visualViewport можуть спрацьовувати рідше, ніж
 * триває сама анімація панелі браузера), а після короткої паузи бездіяльності
 * робиться фінальний перерахунок і цикл зупиняється.
 *
 * Важливо: результат застосовується напряму до DOM-елемента (el.style.transform),
 * а не через React state. Це навмисно — інакше довелось би оновлювати state
 * до 60 разів/сек під час скролу, що спричиняло б ре-рендер усього батьківського
 * компонента (і всіх його дітей) на кожен кадр. Пряма мутація style є
 * "compositor-only" операцією (transform), яка не викликає layout/reflow і
 * не навантажує React.
 */
export function useVisualViewportOffset<T extends HTMLElement>(
  ref: RefObject<T | null>
) {
  const rafIdRef = useRef<number | null>(null);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isIOS()) return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const measure = () => {
      const el = ref.current;
      if (!el) return;

      const layoutHeight = window.innerHeight;
      const visualBottom = viewport.height + viewport.offsetTop;
      const diff = layoutHeight - visualBottom;

      el.style.transform = diff > 0 ? `translateY(-${Math.round(diff)}px)` : "";
    };

    const tick = () => {
      measure();
      rafIdRef.current = requestAnimationFrame(tick);
    };

    const startTicking = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(tick);
    };

    const stopTicking = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      measure();
    };

    const handleActivity = () => {
      startTicking();

      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(stopTicking, IDLE_DELAY_MS);
    };

    measure();

    viewport.addEventListener("resize", handleActivity);
    viewport.addEventListener("scroll", handleActivity);
    window.addEventListener("scroll", handleActivity, { passive: true });
    window.addEventListener("touchmove", handleActivity, { passive: true });
    window.addEventListener("touchend", handleActivity, { passive: true });
    window.addEventListener("orientationchange", handleActivity);

    return () => {
      viewport.removeEventListener("resize", handleActivity);
      viewport.removeEventListener("scroll", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchmove", handleActivity);
      window.removeEventListener("touchend", handleActivity);
      window.removeEventListener("orientationchange", handleActivity);

      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [ref]);
}
