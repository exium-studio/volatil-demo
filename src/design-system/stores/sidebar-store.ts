// src/design-system/stores/sidebar-store.ts

import type {
  SidebarActions,
  SidebarState,
} from "@/design-system/stores/types/sidebar-store.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
