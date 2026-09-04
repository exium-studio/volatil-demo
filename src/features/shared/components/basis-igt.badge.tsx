// src/features/shared/components/basis-igt.badge.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { IGT_BASIS_MAP } from "@/shared/constants/status.config";
import type { IgtBasisBadgeProps } from "@/features/shared/types/badge.type";
import type { IgtBasisType } from "@/features/mitra/cart/types/mitra.cart.batch.type";

export const BasisIgtBadge = (props: IgtBasisBadgeProps) => {
  // Props
  const {
    children,
    showIcon = true,
    variant = "subtle",
    ...restProps
  } = props;

  // Derived Values
  const basisKey = (children ?? "") as IgtBasisType;
  const config = IGT_BASIS_MAP[basisKey];

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
