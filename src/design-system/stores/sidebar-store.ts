// src/design-system/stores/sidebar-store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarState = {
  expandedByKey: Record<string, boolean>;
};

type SidebarActions = {
  setExpanded: (key: string, value: boolean) => void;
  toggleExpanded: (key: string, defaultValue?: boolean) => void;
};

export const useSidebarStore = create<SidebarState & SidebarActions>()(
  persist(
    (set, get) => ({
      expandedByKey: {},

      setExpanded: (key, value) => {
        set((state) => ({
          expandedByKey: { ...state.expandedByKey, [key]: value },
        }));
      },

      toggleExpanded: (key, defaultValue = false) => {
        const current = get().expandedByKey[key] ?? defaultValue;
        get().setExpanded(key, !current);
      },
    }),
    {
      name: "nav-store",
    },
  ),
);
