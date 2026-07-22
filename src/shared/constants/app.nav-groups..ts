// src/shared/constants/app.nav-groups..ts

import type { AppNavKey } from "@/shared/types/app-navs.type";
import type { NavGroup } from "@/shared/types/nav.type";

export const APP_NAV_GROUPS: NavGroup<AppNavKey>[] = [
  {
    items: [
      { key: "home" },
      { key: "data_request" },
      { key: "cart" },
      { key: "purchase_history" },
      { key: "my_data" },
    ],
  },
];
