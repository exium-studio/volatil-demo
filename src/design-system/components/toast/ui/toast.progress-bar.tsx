// src/design-system/components/toast/ui/toast.progress-bar.tsx

import { Box } from "@/design-system/components/layout/ui/box";
import type { ToastItemData } from "@/design-system/components/toast/types/toast.types";
import { useColorModeValue } from "@/design-system/hooks/use-color-mode";

export function ToastProgressBar({ toast }: { toast: ToastItemData }) {
  const bg = useColorModeValue("bg.emphasized", "bg.muted");

  if (toast.duration === null) return null;

  return (
    <Box
      key={toast.updatedAt}
      pos={"absolute"}
      left={"16px"}
      top={0}
      h={"2px"}
      w={"calc(100% - 32px)"}
      bg={bg}
      transformOrigin={"left"}
      animationName={"shrink-x"}
      animationDuration={`${toast.duration}ms`}
      animationTimingFunction={"linear"}
      animationFillMode={"forwards"}
      animationPlayState={toast.paused ? "paused" : "running"}
    />
  );
}
