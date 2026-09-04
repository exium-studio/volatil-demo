// src/features/shared/components/transaction-status.badge.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Badge } from "@/design-system/components/typography/ui/badge";
import type { TransactionStatusBadgeProps } from "@/features/shared/types/badge.type";
import { TRANSACTION_STATUS_MAP } from "@/shared/constants/status.config";
import type { TransactionStatus } from "@/shared/types/status.type";

export const TransactionStatusBadge = (props: TransactionStatusBadgeProps) => {
  // Props
  const {
    children,
    showIcon = false,
    variant = "subtle",
    ...restProps
  } = props;

  // Derived Values
  const statusKey = (children ?? "") as TransactionStatus;
  const config = TRANSACTION_STATUS_MAP[statusKey];

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
