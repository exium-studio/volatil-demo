// src/features/shared/components/order-status.badge.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Badge } from "@/design-system/components/typography/ui/badge";
import type { OrderStatusBadgeProps } from "@/features/shared/types/badge.type";
import { ORDER_STATUS_MAP } from "@/shared/constants/status.config";
import type { OrderStatus } from "@/shared/types/status.type";

export const OrderStatusBadge = (props: OrderStatusBadgeProps) => {
  // Props
  const {
    children,
    showIcon = false,
    variant = "subtle",
    ...restProps
  } = props;

  // Derived Values
  const statusKey = (children ?? "") as OrderStatus;
  const config = ORDER_STATUS_MAP[statusKey];

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
