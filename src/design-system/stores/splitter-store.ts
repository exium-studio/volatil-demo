// src/design-system/stores/splitter-store.ts

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SplitterState = {
  sizesByKey: Record<string, number[]>;
};

type SplitterActions = {
  setSize: (key: string, size: number[]) => void;
};

let persistTimeoutId: ReturnType<typeof setTimeout> | null = null;

const debouncedStorage = {
  getItem: (name: string) => (typeof window !== "undefined" ? localStorage.getItem(name) : null),
  setItem: (name: string, value: string) => {
    if (typeof window === "undefined") return;
    if (persistTimeoutId !== null) clearTimeout(persistTimeoutId);
    persistTimeoutId = setTimeout(() => {
      localStorage.setItem(name, value);
      persistTimeoutId = null;
    }, 300);
  },
  removeItem: (name: string) => {
    if (typeof window !== "undefined") localStorage.removeItem(name);
  },
};

export const useSplitterStore = create<SplitterState & SplitterActions>()(
  persist(
    (set) => ({
      sizesByKey: {},

      setSize: (key, size) => {
        set((state) => ({
          sizesByKey: { ...state.sizesByKey, [key]: size },
        }));
      },
    }),
    {
      name: "splitter-store",
      storage: createJSONStorage(() => debouncedStorage),
    },
  ),
);
