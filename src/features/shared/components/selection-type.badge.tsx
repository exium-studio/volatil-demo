// src/features/shared/components/selection-type.badge.tsx

import { Badge } from "@/design-system/components/typography/ui/badge";
import { SELECTION_TYPE_CONFIG_MAP } from "@/features/mitra/cart/constants/cart.config";
import type { SelectionType } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import type { SelectionTypeBadgeProps } from "@/features/shared/types/badge.type";

export const SelectionTypeBadge = (props: SelectionTypeBadgeProps) => {
  // Props
  const { children, ...restProps } = props;

  // Derived Values
  const typeKey = (children ?? "") as SelectionType;
  const config = SELECTION_TYPE_CONFIG_MAP[typeKey];

  return (
    <Badge
      colorPalette={config?.colorPalette ?? "gray"}
      variant={config?.variant ?? "subtle"}
      {...restProps}
    >
      {config?.label ?? children ?? "-"}
    </Badge>
  );
};
