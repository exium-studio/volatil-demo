// src/shared/constants/app.nav-groups..ts

import type { AdminAppNavKey, AppNavKey } from "@/shared/types/app-navs.type";
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

export const APP_OTHER_NAV_GROUPS: NavGroup<AppNavKey>[] = [
  {
    items: [{ key: "notification" }, { key: "help" }],
  },
];

export const ADMIN_APP_NAV_GROUPS: NavGroup<AdminAppNavKey>[] = [
  {
    items: [
      { key: "home" },
      { key: "user_management" },
      { key: "data_management" },
      { key: "order_statistic" },
      { key: "help" },
    ],
  },
];

export const ADMIN_APP_OTHER_NAV_GROUPS: NavGroup<AdminAppNavKey>[] = [
  {
    items: [{ key: "notification" }],
  },
];
