// src/design-system/components/toast/ui/toast.icon.tsx

import { Circle } from "@/design-system/components/layout/ui/box";
import type { ToastIconProps } from "@/design-system/components/toast/types/toast.type";

export function ToastIcon(props: ToastIconProps) {
  // Props
  const { toast, icon, ...restProps } = props;
  const resolvedIcon = toast.icon ?? icon;

  if (!resolvedIcon) return null;

  return (
    <Circle
      data-toast-icon={toast.variant}
      w={"24px"}
      h={"24px"}
      rounded={"full"}
      p={1}
      {...restProps}
    >
      {resolvedIcon}
    </Circle>
  );
}
