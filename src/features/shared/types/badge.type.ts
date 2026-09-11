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
import type { UserRole } from "@/shared/types/common-response.type";

export type IgtBasisBadgeProps = Omit<BadgeProps, "children"> & {
  children?: IgtBasisType | (string & {});
  showIcon?: boolean;
};

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

export type MitraLayerSyncJobStatusBadgeProps = Omit<BadgeProps, "children"> & {
  children?: string;
  showIcon?: boolean;
};

export type UserRoleBadgeProps = Omit<BadgeProps, "children"> & {
  children?: UserRole | (string & {});
  showIcon?: boolean;
};
