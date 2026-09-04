// src/features/shared/types/badge.type.ts

import type { BadgeProps } from "@/design-system/components/typography/types/badge.type";
import type {
  SelectionType,
  SpatialBasisType,
} from "@/features/mitra/cart/types/mitra.cart.order.type";
import type { OrderStatus } from "@/shared/types/status.type";

export type SpatialBasisBadgeProps = Omit<BadgeProps, "children"> & {
  children?: SpatialBasisType | (string & {});
};

export type SelectionTypeBadgeProps = Omit<BadgeProps, "children"> & {
  children?: SelectionType | (string & {});
};

export type OrderStatusBadgeProps = Omit<BadgeProps, "children"> & {
  children?: OrderStatus | (string & {});
  showIcon?: boolean;
};

export type BatchStatusBadgeProps = OrderStatusBadgeProps;
