// src/design-system/components/overlay/ui/action-bar.tsx

import type {
  ActionBarCloseTriggerProps,
  ActionBarContentProps,
  ActionBarPositionerProps,
  ActionBarRootProps,
  ActionBarSeparatorProps,
} from "@/design-system/components/overlay/types/action-bar.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { ActionBar as ChakraActioBar } from "@chakra-ui/react";

const ActionBarRoot = (props: ActionBarRootProps) => {
  return <ChakraActioBar.Root {...props} />;
};

const ActionBarPositioner = (props: ActionBarPositionerProps) => {
  return <ChakraActioBar.Positioner {...props} />;
};

const ActionBarContent = (props: ActionBarContentProps) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraActioBar.Content
      gap={1}
      p={1}
      bg={"bg.body"}
      rounded={theme.radii.container}
      border={"1px solid {colors.border.subtle}"}
      shadow={"md"}
      _open={{
        animationDuration: "slow",
      }}
      _closed={{
        animationDuration: "slow",
      }}
      {...props}
    />
  );
};

const ActionBarSeparator = (props: ActionBarSeparatorProps) => {
  return <ChakraActioBar.Separator bg={"border.muted"} {...props} />;
};

const ActionBarCloseTrigger = (props: ActionBarCloseTriggerProps) => {
  return <ChakraActioBar.CloseTrigger asChild {...props} />;
};

export const ActionBar = {
  Root: ActionBarRoot,
  Positioner: ActionBarPositioner,
  Content: ActionBarContent,
  Separator: ActionBarSeparator,
  CloseTrigger: ActionBarCloseTrigger,
};
