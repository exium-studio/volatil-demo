// src/design-system/components/button/ui/color-mode.tsx

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { BoxProps } from "@/design-system/components/layout/types/box.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { EclipseIcon, SunIcon } from "lucide-react";

type ColorModeToggleButtonProps = IconButtonProps;

export const ColorModeToggleButton = (props: ColorModeToggleButtonProps) => {
  // Hooks
  const { colorMode } = useColorMode();

  return (
    <ColorModeToggleTrigger>
      <IconButton {...props}>
        <AppIcon icon={colorMode === "light" ? SunIcon : EclipseIcon} />
      </IconButton>
    </ColorModeToggleTrigger>
  );
};

export const ColorModeToggleTrigger = (props: BoxProps) => {
  // Hooks
  const { toggleColorMode } = useColorMode();

  return <Box asChild onClick={toggleColorMode} {...props} />;
};
