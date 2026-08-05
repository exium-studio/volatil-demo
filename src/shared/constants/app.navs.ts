// src/shared/constants/app.navs.ts

import type { NavItem } from "@/shared/types/nav.type";
import {
  BellIcon,
  DatabaseIcon,
  HelpCircleIcon,
  HistoryIcon,
  HouseIcon,
  ReceiptTextIcon,
  ShoppingCartIcon,
  SquarePen,
  UsersIcon,
} from "lucide-react";

export const APP_NAVS_MAP = {
  home: {
    icon: HouseIcon,
    titleKey: "app.navs.home",
    pathname: "/portal/home",
  },
  data_request: {
    icon: SquarePen,
    titleKey: "app.navs.data_request",
    pathname: "/portal/data-request",
  },
  cart: {
    icon: ShoppingCartIcon,
    titleKey: "app.navs.cart",
    pathname: "/portal/cart",
  },
  purchase_history: {
    icon: HistoryIcon,
    titleKey: "app.navs.purchase_history",
    pathname: "/portal/purchase-history",
  },
  my_data: {
    icon: DatabaseIcon,
    titleKey: "app.navs.my_data",
    pathname: "/portal/my-data",
  },
  notification: {
    icon: BellIcon,
    titleKey: "app.navs.notification",
    pathname: "/portal/notification",
  },
  help: {
    icon: HelpCircleIcon,
    titleKey: "app.navs.help",
    pathname: "/portal/support-ticket",
  },
} as const satisfies Record<string, NavItem>;

// Admin
export const ADMIN_APP_NAVS_MAP = {
  home: {
    icon: HouseIcon,
    titleKey: "app.navs.home",
    pathname: "/admin/home",
  },
  user_management: {
    icon: UsersIcon,
    titleKey: "app.admin_navs.user_management",
    pathname: "/admin/user-management",
  },
  data_management: {
    icon: DatabaseIcon,
    titleKey: "app.admin_navs.data_management",
    pathname: "/admin/data-management",
  },
  order_statistic: {
    icon: ReceiptTextIcon,
    titleKey: "app.admin_navs.order_statistic",
    pathname: "/admin/order-statistic",
  },
  help: {
    icon: HelpCircleIcon,
    titleKey: "app.admin_navs.help",
    pathname: "/admin/support-ticket",
  },
  notification: {
    icon: BellIcon,
    titleKey: "app.navs.notification",
    pathname: "/portal/notification",
  },
} as const satisfies Record<string, NavItem>;
