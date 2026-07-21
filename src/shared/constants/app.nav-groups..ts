// src/shared/constants/app.navs-groups..ts

import type { AppNavKey } from "@/shared/types/app-navs.type";
import type { NavGroup } from "@/shared/types/nav.type";

export const APP_NAV_GROUPS: NavGroup<AppNavKey>[] = [
  {
    items: [
      { key: "home" },
      { key: "users" },
      { key: "analytics" },
      { key: "reports" },
      { key: "billing" },
    ],
  },
];
