// src/design-system/stores/use-nav-store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

type NavState = {
  expandedByKey: Record<string, boolean>;
};

type NavActions = {
  setExpanded: (key: string, value: boolean) => void;
  toggleExpanded: (key: string, defaultValue?: boolean) => void;
};

export const useNavStore = create<NavState & NavActions>()(
  persist(
    (set, get) => ({
      expandedByKey: {},

      setExpanded: (key, value) => {
        set((state) => ({
          expandedByKey: { ...state.expandedByKey, [key]: value },
        }));
      },

      toggleExpanded: (key, defaultValue = true) => {
        const current = get().expandedByKey[key] ?? defaultValue;
        get().setExpanded(key, !current);
      },
    }),
    {
      name: "nav-store",
    },
  ),
);
