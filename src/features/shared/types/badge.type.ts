// src/features/shared/types/badge.type.ts

import type { BadgeProps } from "@/design-system/components/typography/types/badge.type";
import type {
  SelectionType,
  IgtBasisType,
} from "@/features/mitra/cart/types/mitra.cart.order.type";
import type {
  MyDataStatus,
  OrderStatus,
  TransactionStatus,
} from "@/shared/types/status.type";

export type IgtBasisBadgeProps = Omit<BadgeProps, "children"> & {
  children?: IgtBasisType | (string & {});
  showIcon?: boolean;
};

/** @deprecated alias for IgtBasisBadgeProps */
export type SpatialBasisBadgeProps = IgtBasisBadgeProps;

export type SelectionTypeBadgeProps = Omit<BadgeProps, "children"> & {
  children?: SelectionType | (string & {});
  showIcon?: boolean;
};

export type OrderStatusBadgeProps = Omit<BadgeProps, "children"> & {
  children?: OrderStatus | (string & {});
  showIcon?: boolean;
};

export type TransactionStatusBadgeProps = Omit<BadgeProps, "children"> & {
  children?: TransactionStatus | (string & {});
  showIcon?: boolean;
};

export type MyDataStatusBadgeProps = Omit<BadgeProps, "children"> & {
  children?: MyDataStatus | (string & {});
  showIcon?: boolean;
};
