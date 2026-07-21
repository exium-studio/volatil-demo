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
    href: "/portal/home",
  },
  users: {
    icon: UsersIcon,
    titleKey: "app.nav.users",
    href: "/portal/home",
  },
  analytics: {
    icon: ChartLineIcon,
    titleKey: "app.nav.analytics",
    href: "/portal/home",
  },
  reports: {
    icon: ClipboardListIcon,
    titleKey: "app.nav.reports",
    href: "/portal/home",
  },
  billing: {
    icon: ReceiptIcon,
    titleKey: "app.nav.billing",
    href: "/portal/home",
  },
} as const satisfies Record<string, NavItem>;
