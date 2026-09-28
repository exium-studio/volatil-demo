// src/design-system/stores/types/sidebar-store.type.ts

export type SidebarState = {
  expandedByKey: Record<string, boolean>;
};

export type SidebarActions = {
  setExpanded: (key: string, value: boolean) => void;
  toggleExpanded: (key: string, defaultValue?: boolean) => void;
};
