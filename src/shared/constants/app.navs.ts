// src/shared/constants/app.navs.ts

import type { NavItem } from "@/shared/types/nav.type";
import {
  BellIcon,
  BlocksIcon,
  CheckCircleIcon,
  CreditCardIcon,
  DatabaseIcon,
  HandshakeIcon,
  HeadsetIcon,
  HistoryIcon,
  HouseIcon,
  KeyRoundIcon,
  LayersIcon,
  ListChecksIcon,
  MailIcon,
  ReceiptTextIcon,
  ServerIcon,
  ShoppingCartIcon,
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
    icon: ShoppingCartIcon,
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
  order_review: {
    icon: CheckCircleIcon,
    titleKey: "app.admin_navs.order_review",
    pathname: "/internal/order-review",
  },
  order_statistic: {
    icon: ReceiptTextIcon,
    titleKey: "app.admin_navs.order_statistic",
    pathname: "/internal/order-statistic",
  },
  mitra_registration: {
    icon: HandshakeIcon,
    titleKey: "app.admin_navs.mitra_registration",
    pathname: "/internal/mitra-registration",
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
  master_igt_layer: {
    icon: LayersIcon,
    titleKey: "app.admin_navs.master_igt_layer",
    pathname: "/internal/master-igt-layer",
  },
  integration: {
    icon: BlocksIcon,
    titleKey: "app.admin_navs.integration",
    pathname: "/internal/integrations/sso",
  },
  sso_keycloak: {
    icon: KeyRoundIcon,
    titleKey: "app.admin_navs.sso_keycloak",
    pathname: "/internal/integrations/sso",
  },
  smtp_email: {
    icon: MailIcon,
    titleKey: "app.admin_navs.smtp_email",
    pathname: "/internal/integrations/smtp",
  },
  simponi_pnbp: {
    icon: CreditCardIcon,
    titleKey: "app.admin_navs.simponi_pnbp",
    pathname: "/internal/integrations/simponi",
  },
  jobs: {
    icon: ListChecksIcon,
    titleKey: "app.admin_navs.jobs",
    pathname: "/internal/jobs",
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
