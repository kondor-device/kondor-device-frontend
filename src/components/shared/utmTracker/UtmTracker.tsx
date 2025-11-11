"use client";
import { useEffect } from "react";
import { useUtmStore } from "@/store/utmStore";
import { parseUtmParams, hasUtmParams } from "@/utils/parseUtmParams";

/**
 * Компонент для автоматичного відстеження UTM-міток
 * Парсить UTM-параметри з URL при завантаженні сторінки
 */
export default function UtmTracker() {
  const { setUtmData, utmData } = useUtmStore();

  useEffect(() => {
    // Перевіряємо, чи є UTM-параметри в URL
    if (hasUtmParams()) {
      const parsedUtmData = parseUtmParams();

      if (parsedUtmData) {
        // Зберігаємо UTM-дані в стор тільки якщо їх ще немає
        // Це запобігає перезапису UTM-даних при навігації між сторінками
        if (!utmData) {
          setUtmData(parsedUtmData);
        }
      }
    }
  }, [setUtmData, utmData]);

  // Цей компонент не рендерить нічого
  return null;
}
