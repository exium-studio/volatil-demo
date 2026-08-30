// src/features/shared/components/batch-status.badge.tsx

import { Badge } from "@/design-system/components/typography/ui/badge";
import { CART_BATCH_STATUS_CONFIG_MAP } from "@/features/mitra/cart/constants/cart.config";
import type { CartBatchStatus } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import type { BatchStatusBadgeProps } from "@/features/shared/types/badge.type";

export const BatchStatusBadge = (props: BatchStatusBadgeProps) => {
  // Props
  const { children, variant = "subtle", ...restProps } = props;

  // Derived Values
  const statusKey = (children ?? "") as CartBatchStatus;
  const config = CART_BATCH_STATUS_CONFIG_MAP[statusKey];

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
