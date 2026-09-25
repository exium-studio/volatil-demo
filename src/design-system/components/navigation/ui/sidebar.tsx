// src\design-system\components\navigation\ui\sidebar.tsx

// src\design-system\components\navigation\ui\sidebar.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import type {
  SidebarBodyProps,
  SidebarContextValue,
  SidebarFooterProps,
  SidebarHeaderProps,
  SidebarRootProps,
  SidebarSeparatorProps,
  SidebarToggleButtonProps,
} from "@/design-system/components/navigation/types/sidebar.type";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { useSidebarStore } from "@/design-system/stores/sidebar-store";
import { t } from "@/shared/libs/i18n";
import {
  IconChevronCompactLeft,
  IconChevronCompactRight,
} from "@tabler/icons-react";
import React, { createContext, useContext } from "react";

export const SIDEBAR_COLLAPSED_W = 64;
export const SIDEBAR_EXPANDED_W = 240;

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  return context;
};

export const SidebarRoot = (props: SidebarRootProps) => {
  // Props
  const {
    children,
    expandable = false,
    collapsedWidth = SIDEBAR_COLLAPSED_W,
    expandedWidth = SIDEBAR_EXPANDED_W,
    defaultExpanded = false,
    expanded: controlledExpanded,
    onExpandedChange,
    ...restProps
  } = props;

  const sidebarKey = props.sidebarKey;

  // Stores
  const storedExpanded = useSidebarStore(
    (s) =>
      (sidebarKey ? s.expandedByKey[sidebarKey] : undefined) ?? defaultExpanded,
  );
  const toggleExpandedStore = useSidebarStore((s) => s.toggleExpanded);

  // Derived Values
  const isExpanded =
    controlledExpanded !== undefined
      ? controlledExpanded
      : expandable
        ? storedExpanded
        : true;
  const currentWidth = isExpanded ? expandedWidth : collapsedWidth;

  // Handlers
  const handleToggle = () => {
    if (sidebarKey) {
      toggleExpandedStore(sidebarKey, defaultExpanded);
    }
    onExpandedChange?.(!isExpanded);
  };

  // Context Value
  const contextValue: SidebarContextValue = {
    expanded: isExpanded,
    sidebarKey,
    defaultExpanded,
    toggleExpanded: handleToggle,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <Box
        className={"group"}
        pos={"relative"}
        zIndex={10}
        w={`${currentWidth}px`}
        h={"full"}
        transition={"200ms"}
        {...restProps}
      >
        <VStack
          overflowY={"auto"}
          overflowX={"clip"}
          h={"full"}
          py={"3px"}
          bg={"bg.body"}
          borderRight={restProps.borderRight ?? "1px solid"}
          borderColor={restProps.borderColor ?? "bg.subtle"}
          align={"stretch"}
          gap={0}
        >
          {children}
        </VStack>

        {expandable && (
          <SidebarToggleButton
            sidebarKey={sidebarKey}
            defaultExpanded={defaultExpanded}
            onToggle={onExpandedChange}
          />
        )}
      </Box>
    </SidebarContext.Provider>
  );
};

export const SidebarHeader = (props: SidebarHeaderProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <HStack
      align={"center"}
      justify={"space-between"}
      h={"headerH"}
      p={4}
      w={"full"}
      flexShrink={0}
      {...restProps}
    >
      {children}
    </HStack>
  );
};

export const SidebarBody = (props: SidebarBodyProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <VStack flex={1} overflowY={"auto"} minH={0} {...restProps}>
      {children}
    </VStack>
  );
};

export const SidebarFooter = (props: SidebarFooterProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <VStack flexShrink={0} align={"stretch"} gap={1} p={3} {...restProps}>
      {children}
    </VStack>
  );
};

export const SidebarSeparator = (props: SidebarSeparatorProps) => {
  // Props
  const { mx = 2, ...restProps } = props;

  return <Separator mx={mx} flexShrink={0} {...restProps} />;
};

export const SidebarToggleButton = (props: SidebarToggleButtonProps) => {
  // Props
  const {
    sidebarKey: propSidebarKey,
    defaultExpanded: propDefaultExpanded,
    onToggle,
  } = props;

  // Context
  const context = useSidebarContext();

  const sidebarKey = propSidebarKey ?? context?.sidebarKey;
  const defaultExpanded =
    propDefaultExpanded ?? context?.defaultExpanded ?? false;

  // Stores
  const storedExpanded = useSidebarStore(
    (s) =>
      (sidebarKey ? s.expandedByKey[sidebarKey] : undefined) ?? defaultExpanded,
  );
  const toggleExpanded = useSidebarStore((s) => s.toggleExpanded);

  // Derived Values
  const isExpanded = context ? context.expanded : storedExpanded;

  // Handlers
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (context) {
      context.toggleExpanded();
    } else if (sidebarKey) {
      toggleExpanded(sidebarKey, defaultExpanded);
      onToggle?.(!isExpanded);
    }
  };

  return (
    <Tooltip
      content={isExpanded ? t["action.collapse"]() : t["action.expand"]()}
      positioning={{
        placement: "right",
      }}
    >
      <Center
        h={"full"}
        w={"16px"}
        pos={"absolute"}
        right={"-8px"}
        top={0}
        zIndex={99}
        opacity={0}
        cursor={"pointer"}
        _groupHover={{ opacity: 1 }}
        transition={"200ms"}
        onClick={handleToggle}
      >
        <IconButton
          aria-label={
            isExpanded ? t["action.collapse"]() : t["action.expand"]()
          }
          variant={"blend"}
          size={"2xs"}
          minW={"16px"}
          w={"16px"}
          h={"80px"}
          color={"fg.muted"}
          rounded={"full"}
          border={"1px solid"}
          borderColor={"border.subtle"}
          pointerEvents={"none"}
        >
          <AppIcon
            icon={isExpanded ? IconChevronCompactLeft : IconChevronCompactRight}
            size={"sm"}
          />
        </IconButton>
      </Center>
    </Tooltip>
  );
};

export const Sidebar = Object.assign(SidebarRoot, {
  Root: SidebarRoot,
  Header: SidebarHeader,
  Body: SidebarBody,
  Footer: SidebarFooter,
  Separator: SidebarSeparator,
  Toggle: SidebarToggleButton,
});
