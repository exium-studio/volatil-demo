// src/design-system/components/button/ui/color-mode-button.tsx

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { EclipseIcon, SunIcon } from "lucide-react";

type ColorModeToggleButtonProps = IconButtonProps;

export const ColorModeToggleButton = (props: ColorModeToggleButtonProps) => {
  // Hooks
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton {...props} onClick={toggleColorMode}>
      <AppIcon icon={colorMode === "light" ? SunIcon : EclipseIcon} />
    </IconButton>
  );
};
