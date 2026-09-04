// src/features/shared/components/basis-igt.badge.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { SPATIAL_BASIS_CONFIG_MAP } from "@/features/mitra/cart/constants/orders.config";
import type { SpatialBasisType } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import type { SpatialBasisBadgeProps } from "@/features/shared/types/badge.type";

export const BasisIgtBadge = (props: SpatialBasisBadgeProps) => {
  // Props
  const {
    children,
    showIcon = true,
    variant = "subtle",
    ...restProps
  } = props;

  // Derived Values
  const basisKey = (children ?? "") as SpatialBasisType;
  const config = SPATIAL_BASIS_CONFIG_MAP[basisKey];

  return (
    <Badge
      colorPalette={config?.colorPalette ?? "gray"}
      variant={variant}
      {...restProps}
    >
      {showIcon && config?.icon && <AppIcon icon={config.icon} size={"xs"} />}

      {config?.label ?? children ?? "-"}
    </Badge>
  );
};
