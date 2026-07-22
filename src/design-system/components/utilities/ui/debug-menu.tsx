// src/design-system/components/utilities/ui/debug-menu.tsx

"use client";

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { ColorModeToggleTrigger } from "@/design-system/components/button/ui/color-mode";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { CodeIcon } from "lucide-react";

export const DebugMenu = () => {
  const { colorMode } = useColorMode();

  return (
    <Box pos={"fixed"} right={2} bottom={2} zIndex={"toast"}>
      <Popover.Root>
        <Popover.Trigger>
          <IconButton>
            <AppIcon icon={CodeIcon} />
          </IconButton>
        </Popover.Trigger>

        <Popover.Content w={"260px"}>
          <ColorModeToggleTrigger>
            <Button justifyContent={"space-between"} gap={4}>
              Toggle dark mode
              <Switch checked={colorMode === "dark"} />
            </Button>
          </ColorModeToggleTrigger>
        </Popover.Content>
      </Popover.Root>
    </Box>
  );
};
