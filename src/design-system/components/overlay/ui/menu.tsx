// src/design-system/components/overlay/ui/menu.tsx

import { Box } from "@/design-system/components/layout/ui/box";
import type {
  MenuContentProps,
  MenuContextTriggerProps,
  MenuItemProps,
  MenuRootProps,
  MenuTriggerProps,
} from "@/design-system/components/overlay/types/menu.type";
import { Portal } from "@/design-system/components/utilities/ui/portal";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Menu as ChakraMenu } from "@chakra-ui/react";

const MenuRoot = (props: MenuRootProps) => {
  const { positioning, ...restProps } = props;

  return (
    <ChakraMenu.Root
      positioning={{ hideWhenDetached: true, ...positioning }}
      {...restProps}
    />
  );
};

const MenuTrigger = (props: MenuTriggerProps) => {
  return <ChakraMenu.Trigger asChild {...props} />;
};

const MenuContextTrigger = (props: MenuContextTriggerProps) => {
  return <ChakraMenu.ContextTrigger asChild {...props} />;
};

const MenuContent = (props: MenuContentProps) => {
  // Props
  const { portalled = true, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <Portal disabled={!portalled}>
      <ChakraMenu.Positioner>
        <ChakraMenu.Content
          p={1}
          bg={"bg.body"}
          rounded={theme.radii.container}
          border={"1px solid"}
          borderColor={"border.subtle"}
          shadow={"sm"}
          _open={{
            animation: "scale-up-overshoot",
            animationDuration: "slow",
          }}
          _closed={{
            animation: "scale-down",
            animationDuration: "moderate",
          }}
          {...restProps}
        />
      </ChakraMenu.Positioner>
    </Portal>
  );
};

const MenuItem = (props: MenuItemProps) => {
  // Props
  const { disabled, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <Box cursor={disabled ? "not-allowed" : undefined}>
      <ChakraMenu.Item
        disabled={disabled}
        rounded={theme.radii.component}
        fontSize={"md"}
        cursor={"pointer"}
        pointerEvents={disabled ? "none" : "auto"}
        userSelect={"none"}
        transition={"200ms"}
        _hover={{
          bg: "bg.subtle",
        }}
        {...restProps}
      />
    </Box>
  );
};

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  ContextTrigger: MenuContextTrigger,
  Content: MenuContent,
  Item: MenuItem,
};
