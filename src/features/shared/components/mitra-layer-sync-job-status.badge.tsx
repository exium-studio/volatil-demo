// src/features/shared/components/mitra-layer-sync-job-status.badge.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { MITRA_LAYER_SYNC_JOB_STATUS_MAP } from "@/features/internal/mitra-layer-sync-jobs/constants/mitra-layer-sync-job.config";
import type { MitraLayerSyncJobStatus } from "@/features/internal/mitra-layer-sync-jobs/types/mitra-layer-sync-job.type";
import type { MitraLayerSyncJobStatusBadgeProps } from "@/features/shared/types/badge.type";

export const MitraLayerSyncJobStatusBadge = (
  props: MitraLayerSyncJobStatusBadgeProps,
) => {
  // Props
  const {
    children,
    showIcon = true,
    variant = "subtle",
    size = "sm",
    ...restProps
  } = props;

  // Derived Values
  const statusKey = (children ?? "") as MitraLayerSyncJobStatus;
  const config = MITRA_LAYER_SYNC_JOB_STATUS_MAP[statusKey];

  return (
    <Badge
      colorPalette={config?.colorPalette ?? "gray"}
      variant={variant}
      size={size}
      {...restProps}
    >
      {showIcon && config?.icon && <AppIcon icon={config.icon} size={"xs"} />}

      {config?.label ?? children ?? "-"}
    </Badge>
  );
};
