// src/design-system/components/toast/ui/toast.icon.tsx

import { Center } from "@/design-system/components/layout/ui/center";
import type { ToastIconProps } from "@/design-system/components/toast/types/toast.types";

export function ToastIcon(props: ToastIconProps) {
  // Props
  const { record, icon, ...restProps } = props;
  const resolvedIcon = record.icon ?? icon;

  if (!resolvedIcon) return null;

  return (
    <Center
      data-toast-icon={record.variant}
      w={"24px"}
      h={"24px"}
      rounded={"full"}
      p={1}
      {...restProps}
    >
      {resolvedIcon}
    </Center>
  );
}
