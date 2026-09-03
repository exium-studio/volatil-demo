// src/features/shared/components/batch-status.badge.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { BATCH_STATUS_CONFIG } from "@/features/mitra/cart/constants/cart.config";
import type { CartBatchStatus } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import type { BatchStatusBadgeProps } from "@/features/shared/types/badge.type";

export const BatchStatusBadge = (props: BatchStatusBadgeProps) => {
  // Props
  const {
    children,
    showIcon = false,
    variant = "subtle",
    ...restProps
  } = props;

  // Derived Values
  const statusKey = (children ?? "") as CartBatchStatus;
  const config = BATCH_STATUS_CONFIG[statusKey];

  return (
    <Badge
      colorPalette={config?.colorPalette ?? "gray"}
      variant={variant}
      {...restProps}
    >
      {showIcon && <AppIcon icon={config?.icon} size={"xs"} />}

      {config?.label ?? children ?? "-"}
    </Badge>
  );
};
