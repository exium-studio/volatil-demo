// src/design-system/components/utilities/ui/debug-menu.tsx

"use client";

import { IconButton } from "@/design-system/components/button/ui/button";
import { ColorModeToggleButton } from "@/design-system/components/button/ui/color-mode-button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { CodeIcon } from "lucide-react";

export const DebugMenu = () => {
  return (
    <Box pos={"fixed"} right={2} bottom={2} zIndex={"toast"}>
      <Popover.Root>
        <Popover.Trigger>
          <IconButton>
            <AppIcon icon={CodeIcon} />
          </IconButton>
        </Popover.Trigger>

        <Popover.Content w={"200px"}>
          <ColorModeToggleButton />
        </Popover.Content>
      </Popover.Root>
    </Box>
  );
};
