// src/features/internal/statistik-pesanan/types/internal.transaction-statistic.wms.type.ts

import type { BadgeProps } from "@/design-system/components/typography/types/badge.type";
import type { OrderStatus } from "@/shared/types/status.type";
import type { LucideIcon } from "lucide-react";

export type WmsStatusKey =
  | "pending_payment"
  | "processing"
  | "ready"
  | "expired";

export type WmsStatusConfig = {
  label: string;
  orderStatus: OrderStatus;
  colorPalette: "orange" | "purple" | "green" | "gray";
  icon: LucideIcon;
};

export type InternalWmsStatusBadgeProps = Omit<BadgeProps, "children"> & {
  children?: OrderStatus | WmsStatusKey | string | null;
  showIcon?: boolean;
};

export type InternalTransactionStatisticFilterState = {
  selectedOrderStatus?: OrderStatus;
  setSelectedOrderStatus: (status?: OrderStatus) => void;
  toggleOrderStatus: (status: OrderStatus) => void;
  resetFilter: () => void;
};

