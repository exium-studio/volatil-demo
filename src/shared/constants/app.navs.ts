// src/shared/constants/app.navs.ts

import type { NavItem } from "@/shared/types/nav.type";
import { IconShoppingCart } from "@tabler/icons-react";
import {
  BellIcon,
  CheckCircleIcon,
  DatabaseIcon,
  HandshakeIcon,
  HeadsetIcon,
  HistoryIcon,
  HouseIcon,
  LayersIcon,
  ReceiptTextIcon,
  ServerIcon,
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
  transaction_history: {
    icon: HistoryIcon,
    titleKey: "app.navs.transaction_history",
    pathname: "/mitra/transaction-history",
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
    icon: HeadsetIcon,
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
  master_geoserver: {
    icon: ServerIcon,
    titleKey: "app.admin_navs.master_geoserver",
    pathname: "/internal/master-geoserver",
  },
  data_management: {
    icon: LayersIcon,
    titleKey: "app.admin_navs.data_management",
    pathname: "/internal/data-management",
  },
  batch_review: {
    icon: CheckCircleIcon,
    titleKey: "app.admin_navs.batch_review",
    pathname: "/internal/batch-review",
  },
  mitra_registration: {
    icon: HandshakeIcon,
    titleKey: "app.admin_navs.mitra_registration",
    pathname: "/internal/mitra-registration",
  },
  order_statistic: {
    icon: ReceiptTextIcon,
    titleKey: "app.admin_navs.order_statistic",
    pathname: "/internal/order-statistic",
  },
  help: {
    icon: HeadsetIcon,
    titleKey: "app.admin_navs.help",
    pathname: "/internal/help-center",
  },
  notification: {
    icon: BellIcon,
    titleKey: "app.navs.notification",
    pathname: "/internal/notification",
  },
} as const satisfies Record<string, NavItem>;
