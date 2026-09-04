// src/features/shared/components/my-data-status.badge.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Badge } from "@/design-system/components/typography/ui/badge";
import type { MyDataStatusBadgeProps } from "@/features/shared/types/badge.type";
import { MY_DATA_STATUS_MAP } from "@/shared/constants/status.config";
import type { MyDataStatus } from "@/shared/types/status.type";

export const MyDataStatusBadge = (props: MyDataStatusBadgeProps) => {
  // Props
  const {
    children,
    showIcon = false,
    variant = "subtle",
    ...restProps
  } = props;

  // Derived Values
  const statusKey = (children ?? "") as MyDataStatus;
  const config = MY_DATA_STATUS_MAP[statusKey];

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
