import type { AppNavKey } from "@/shared/types/app-navs.type";
import type { NavGroup } from "@/shared/types/nav.type";

export const APP_NAV_GROUPS: NavGroup<AppNavKey>[] = [
  {
    items: [{ key: "dashboard" }],
  },
];
