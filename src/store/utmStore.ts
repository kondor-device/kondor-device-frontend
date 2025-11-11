"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UtmData {
  utm_source: string;
}

interface UtmStore {
  utmData: UtmData | null;
  setUtmData: (utmData: UtmData) => void;
  clearUtmData: () => void;
  hasUtmData: () => boolean;
}

export const useUtmStore = create<UtmStore>()(
  persist(
    (set, get) => ({
      utmData: null,

      setUtmData: (utmData) => set({ utmData }),

      clearUtmData: () => set({ utmData: null }),

      hasUtmData: () => {
        const { utmData } = get();
        return utmData !== null && Object.keys(utmData).length > 0;
      },
    }),
    {
      name: "kondor-utm-storage",
    }
  )
);
