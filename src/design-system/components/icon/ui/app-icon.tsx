// src/design-system/components/icon/ui/app-icon.tsx

import type {
  AppLucideIconProps,
  AppTablerIconProps,
} from "@/design-system/components/icon/types/app-icon.type";
import { Icon } from "@/design-system/components/icon/ui/icon";
import { LucideIcon } from "@/design-system/components/icon/ui/lucide-icon";
import { LUCIDE_ICON_BASE_ICON_BOX_SIZE } from "@/design-system/constants/styles";

export const AppLucideIcon = (props: AppLucideIconProps) => {
  // Props
  const { icon, lucideIconProps, ...restProps } = props;

  return (
    icon && (
      <Icon boxSize={LUCIDE_ICON_BASE_ICON_BOX_SIZE} {...restProps}>
        <LucideIcon icon={icon} {...lucideIconProps} />
      </Icon>
    )
  );
};

export const AppTablerIcon = (props: AppTablerIconProps) => {
  // Props
  const {
    icon: TablerIcon,
    tablerIconProps,
    size = "md",
    boxSize,
    ...restProps
  } = props;

  const sizes = {
    xs: 3,
    sm: 4,
    md: 5,
    lg: 6,
    xl: 7,
  };

  return (
    TablerIcon && (
      <Icon
        boxSize={boxSize ?? sizes[size as keyof typeof sizes]}
        strokeWidth={1.8}
        {...restProps}
      >
        <TablerIcon {...tablerIconProps} />
      </Icon>
    )
  );
};
