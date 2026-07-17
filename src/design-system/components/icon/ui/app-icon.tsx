// src/design-system/components/icon/ui/app-icon.tsx

import type { AppIconProps } from "@/design-system/components/icon/types/app-icon.type";
import { Icon } from "@/design-system/components/icon/ui/icon";
import { CircleQuestionMarkIcon } from "lucide-react";

export const AppIcon = (props: AppIconProps) => {
  // Props
  const {
    icon = CircleQuestionMarkIcon,
    size = "md",
    boxSize,
    ...restProps
  } = props;

  // Constants
  const sizes = {
    xs: 3.5,
    sm: 4,
    md: 5,
    lg: 6,
    xl: 7,
  };

  // Derived Values
  const IconComponent = icon;

  return (
    <Icon boxSize={boxSize ?? sizes[size as keyof typeof sizes]} {...restProps}>
      <IconComponent />
    </Icon>
  );
};
