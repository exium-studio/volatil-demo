// src/shared/constants/app.navs.ts

import type { NavItem } from "@/shared/types/nav.type";
import { IconShoppingCart } from "@tabler/icons-react";
import {
  BellIcon,
  DatabaseIcon,
  HelpCircleIcon,
  HistoryIcon,
  HouseIcon,
  ReceiptTextIcon,
  SquarePen,
  UsersIcon,
} from "lucide-react";

export const APP_NAVS_MAP = {
  home: {
    icon: HouseIcon,
    titleKey: "app.navs.home",
    pathname: "/mitra/home",
  },
  data_request: {
    icon: SquarePen,
    titleKey: "app.navs.data_request",
    pathname: "/mitra/data-request",
  },
  cart: {
    icon: IconShoppingCart,
    titleKey: "app.navs.cart",
    pathname: "/mitra/cart",
  },
  purchase_history: {
    icon: HistoryIcon,
    titleKey: "app.navs.purchase_history",
    pathname: "/mitra/purchase-history",
  },
  my_data: {
    icon: DatabaseIcon,
    titleKey: "app.navs.my_data",
    pathname: "/mitra/my-data",
  },
  notification: {
    icon: BellIcon,
    titleKey: "app.navs.notification",
    pathname: "/mitra/notification",
  },
  help: {
    icon: HelpCircleIcon,
    titleKey: "app.navs.help",
    pathname: "/mitra/help-center",
  },
} as const satisfies Record<string, NavItem>;

// Admin
export const INTERNAL_APP_NAVS_MAP = {
  home: {
    icon: HouseIcon,
    titleKey: "app.navs.home",
    pathname: "/internal/home",
  },
  user_management: {
    icon: UsersIcon,
    titleKey: "app.admin_navs.user_management",
    pathname: "/internal/user-management",
  },
  data_management: {
    icon: DatabaseIcon,
    titleKey: "app.admin_navs.data_management",
    pathname: "/internal/data-management",
  },
  order_statistic: {
    icon: ReceiptTextIcon,
    titleKey: "app.admin_navs.order_statistic",
    pathname: "/internal/order-statistic",
  },
  help: {
    icon: HelpCircleIcon,
    titleKey: "app.admin_navs.help",
    pathname: "/internal/help-center",
  },
  notification: {
    icon: BellIcon,
    titleKey: "app.navs.notification",
    pathname: "/internal/notification",
  },
} as const satisfies Record<string, NavItem>;
