import type { NavItem } from "@/shared/types/nav.type";
import { LayoutDashboardIcon } from "lucide-react";

export const APP_NAVS_MAP = {
  dashboard: {
    icon: LayoutDashboardIcon,
    titleKey: "app.nav.dashboard",
  },
} as const satisfies Record<string, NavItem>;
