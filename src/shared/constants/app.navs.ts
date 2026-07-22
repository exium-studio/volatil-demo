// src/shared/constants/app.navs.ts

import type { NavItem } from "@/shared/types/nav.type";
import {
  DatabaseIcon,
  HistoryIcon,
  HouseIcon,
  ShoppingCartIcon,
  SquarePen,
  TicketIcon,
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
  help: {
    icon: TicketIcon,
    titleKey: "app.navs.help",
    pathname: "/portal/support-ticket",
  },
} as const satisfies Record<string, NavItem>;
