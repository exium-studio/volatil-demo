// src/features/shared/components/basis-igt.badge.tsx

import { Badge } from "@/design-system/components/typography/ui/badge";
import { SPATIAL_BASIS_CONFIG_MAP } from "@/features/mitra/cart/constants/orders.config";
import type { SpatialBasisType } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import type { SpatialBasisBadgeProps } from "@/features/shared/types/badge.type";

export const BasisIgtBadge = (props: SpatialBasisBadgeProps) => {
  // Props
  const { children, variant = "subtle", ...restProps } = props;

  // Derived Values
  const basisKey = (children ?? "") as SpatialBasisType;
  const config = SPATIAL_BASIS_CONFIG_MAP[basisKey];

  return (
    <Badge
      colorPalette={config?.colorPalette ?? "gray"}
      variant={variant}
      {...restProps}
    >
      {config?.label ?? children ?? "-"}
    </Badge>
  );
};
