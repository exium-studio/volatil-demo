// src/design-system/components/typography/types/count-badge.type.ts

import type { FloatProps } from "@/design-system/components/layout/types/float.type";
import type { BadgeProps } from "@/design-system/components/typography/types/badge.type";

export type CountBadgeProps = BadgeProps & {
  /** The numerical value to display. Values greater than max (default 99) will render as "99+". */
  count: number;
  /** Maximum displayable count before showing "+" suffix. Defaults to 99. */
  max?: number;
  /** Whether to wrap the badge inside the <Float> component for floating positioning. Defaults to false. */
  isFloating?: boolean;
  /** Props forwarded to the <Float> wrapper component when isFloating is true. */
  floatProps?: FloatProps;
};
