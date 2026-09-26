"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import {
  CartAvailabilityResult,
  validateCartAvailability,
} from "@/utils/validateCartAvailability";

export function useCartAvailabilityCheck(isActive: boolean) {
  const locale = useLocale();
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityNotice, setAvailabilityNotice] =
    useState<CartAvailabilityResult | null>(null);

  useEffect(() => {
    if (!isActive) {
      setAvailabilityNotice(null);
      return;
    }

    let cancelled = false;

    async function check() {
      setIsChecking(true);

      try {
        const result = await validateCartAvailability(locale);
        if (!cancelled) {
          setAvailabilityNotice(result);
        }
      } catch {
        if (!cancelled) {
          setAvailabilityNotice(null);
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [isActive, locale]);

  return { isChecking, availabilityNotice };
}
