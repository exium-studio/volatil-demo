// src/shared/types/app-navs.type.ts

import type {
  ADMIN_APP_NAVS_MAP,
  APP_NAVS_MAP,
} from "@/shared/constants/app.navs";

export type AppNavKey = keyof typeof APP_NAVS_MAP;

export type AdminAppNavKey = keyof typeof ADMIN_APP_NAVS_MAP;
