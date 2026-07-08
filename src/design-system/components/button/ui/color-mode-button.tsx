// src/design-system/components/button/ui/color-mode-button.tsx

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppTablerIcon } from "@/design-system/components/icon/ui/app-icon";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { IconMoon2, IconSunHigh } from "@tabler/icons-react";

type ColorModeToggleButtonProps = IconButtonProps;

export const ColorModeToggleButton = (props: ColorModeToggleButtonProps) => {
  // Hooks
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton {...props} onClick={toggleColorMode}>
      <AppTablerIcon icon={colorMode === "light" ? IconSunHigh : IconMoon2} />
    </IconButton>
  );
};
