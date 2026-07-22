// src/design-system/stores/use-splitter-store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

type SplitterState = {
  sizesByKey: Record<string, number[]>;
};

type SplitterActions = {
  setSize: (key: string, size: number[]) => void;
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
    },
  ),
);
