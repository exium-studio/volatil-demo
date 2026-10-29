// src/shared/constants/app.nav-groups.ts

import type { AdminAppNavKey, AppNavKey } from "@/shared/types/app-navs.type";
import type { NavGroup } from "@/shared/types/nav.type";

export const APP_NAV_GROUPS_LIST: NavGroup<AppNavKey>[] = [
  {
    items: [
      { key: "home" },
      { key: "data_request" },
      { key: "cart" },
      { key: "transaction_history" },
      { key: "my_data" },
    ],
  },
];

export const APP_OTHER_NAV_GROUPS_LIST: NavGroup<AppNavKey>[] = [
  {
    items: [{ key: "notification" }, { key: "help" }],
  },
];

export const INTERNAL_APP_NAV_GROUPS_LIST: NavGroup<AdminAppNavKey>[] = [
  {
    items: [
      { key: "home" },
      { key: "order_review" },
      { key: "order_statistic" },
      { key: "mitra_registration" },
      { key: "user_management" },
      { key: "help" },
      {
        key: "integration",
        children: [
          { key: "master_igt_layer" },
          { key: "master_geoserver" },
          { key: "sso_keycloak" },
          { key: "smtp_email" },
          { key: "simponi_pnbp" },
        ],
      },
    ],
  },
];

export const INTERNAL_APP_OTHER_NAV_GROUPS_LIST: NavGroup<AdminAppNavKey>[] = [
  {
    items: [{ key: "notification" }],
  },
];
