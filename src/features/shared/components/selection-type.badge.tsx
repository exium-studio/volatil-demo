// src/features/shared/components/selection-type.badge.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { SELECTION_TYPE_CONFIG_MAP } from "@/features/shared/constants/app.config";
import type { SelectionType } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import type { SelectionTypeBadgeProps } from "@/features/shared/types/badge.type";

export const SelectionTypeBadge = (props: SelectionTypeBadgeProps) => {
  // Props
  const { children, showIcon = true, variant = "subtle", ...restProps } = props;

  // Derived Values
  const typeKey = (children ?? "") as SelectionType;
  const config = SELECTION_TYPE_CONFIG_MAP[typeKey];

  if (!config?.label) return <P>-</P>;

  return (
    <Badge
      colorPalette={config?.colorPalette ?? "gray"}
      variant={variant}
      {...restProps}
    >
      {showIcon && config?.icon && <AppIcon icon={config.icon} size={"xs"} />}

      {config?.label}
    </Badge>
  );
};
