// src/features/shared/components/mitra-registration-status.badge.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { MITRA_REGISTRATION_STATUS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import type { MitraRegistrationStatusBadgeProps } from "@/features/shared/types/badge.type";
import type { MitraRegistrationStatus } from "@/shared/types/status.type";

export const MitraRegistrationStatusBadge = (
  props: MitraRegistrationStatusBadgeProps,
) => {
  // Props
  const {
    children,
    showIcon = false,
    variant = "subtle",
    ...restProps
  } = props;

  // Derived Values
  const statusKey = (children ?? "") as MitraRegistrationStatus;
  const config = MITRA_REGISTRATION_STATUS_MAP[statusKey];

  return (
    <Badge
      bg={"transparent"}
      px={0}
      colorPalette={config?.colorPalette ?? "gray"}
      variant={variant}
      {...restProps}
    >
      {showIcon && <AppIcon icon={config?.icon} size={"xs"} />}

      {config?.label ?? children ?? "-"}
    </Badge>
  );
};
