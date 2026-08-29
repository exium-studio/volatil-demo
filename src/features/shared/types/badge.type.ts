// src/features/shared/types/badge.type.ts

import type { BadgeProps } from "@/design-system/components/typography/types/badge.type";
import type {
  SelectionType,
  SpatialBasisType,
} from "@/features/mitra/cart/types/mitra.cart.batch.type";

export type SpatialBasisBadgeProps = Omit<BadgeProps, "children"> & {
  children?: SpatialBasisType | (string & {});
};

export type SelectionTypeBadgeProps = Omit<BadgeProps, "children"> & {
  children?: SelectionType | (string & {});
};
