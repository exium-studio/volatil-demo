// src/features/internal/statistik-pesanan/components/internal.wms-status.badge.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Badge } from "@/design-system/components/typography/ui/badge";
import {
  getWmsStatusKey,
  WMS_STATUS_MAP,
} from "@/features/internal/statistik-pesanan/constants/internal.transaction-statistic.wms-map";
import type { InternalWmsStatusBadgeProps } from "@/features/internal/statistik-pesanan/types/internal.transaction-statistic.wms.type";
import type { OrderStatus } from "@/shared/types/status.type";

export const InternalWmsStatusBadge = (props: InternalWmsStatusBadgeProps) => {
  // Props
  const { children, showIcon = true, variant = "subtle", ...restProps } = props;

  // Derived Values
  const statusKey = (children ?? "") as OrderStatus;
  const wmsKey = getWmsStatusKey(statusKey);
  const config = wmsKey ? WMS_STATUS_MAP[wmsKey] : undefined;

  if (!config) {
    return (
      <Badge colorPalette={"gray"} variant={"subtle"} {...restProps}>
        {"Non-WMS"}
      </Badge>
    );
  }

  return (
    <Badge
      colorPalette={config.colorPalette}
      variant={variant}
      {...restProps}
    >
      {showIcon && <AppIcon icon={config.icon} size={"xs"} />}

      {config.label}
    </Badge>
  );
};
