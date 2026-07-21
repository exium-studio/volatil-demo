// src/shared/constants/app.navs.ts

import type { NavItem } from "@/shared/types/nav.type";
import {
  ChartLineIcon,
  ClipboardListIcon,
  HouseIcon,
  ReceiptIcon,
  UsersIcon,
} from "lucide-react";

export const APP_NAVS_MAP = {
  home: {
    icon: HouseIcon,
    titleKey: "app.nav.home",
    pathname: "/portal/home",
  },
  users: {
    icon: UsersIcon,
    titleKey: "app.nav.users",
    pathname: "/portal/home",
  },
  analytics: {
    icon: ChartLineIcon,
    titleKey: "app.nav.analytics",
    pathname: "/portal/home",
  },
  reports: {
    icon: ClipboardListIcon,
    titleKey: "app.nav.reports",
    pathname: "/portal/home",
  },
  billing: {
    icon: ReceiptIcon,
    titleKey: "app.nav.billing",
    pathname: "/portal/home",
  },
} as const satisfies Record<string, NavItem>;
