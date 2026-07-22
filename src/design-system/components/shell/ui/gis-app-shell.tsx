// src/design-system/components/shell/ui/gis-app-shell.tsx

import { AtrLogo } from "@/design-system/components/branding/ui/atr-logo";
import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppPageContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Splitter } from "@/design-system/components/layout/ui/splitter";
import { NavLink } from "@/design-system/components/navigation/ui/link";
import { NavButton } from "@/design-system/components/navigation/ui/nav";
import { VNavs } from "@/design-system/components/navigation/ui/v-navs";
import { getNavKeyFromPathname } from "@/design-system/components/navigation/utils/v-navs.utils";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import type { GisAppShellProps } from "@/design-system/components/shell/types/gis-app-shell.type";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { APP } from "@/design-system/constants/_meta";
import { HEADER_H } from "@/design-system/constants/styles";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { useSidebarStore } from "@/design-system/stores/use-sidebar-store";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { APP_NAV_GROUPS } from "@/shared/constants/app.nav-groups.";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { t } from "@/shared/libs/i18n";
import type { AppNavKey } from "@/shared/types/app-navs.type";
import { Box } from "@chakra-ui/react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BellIcon,
  ChevronsRightIcon,
  HelpCircleIcon,
  UserIcon,
} from "lucide-react";

const DEFAULT_SIDEBAR_EXPANDED = true;
const SIDE_BAR_KEY = "app";

export const GisAppShell = (props: GisAppShellProps) => {
  // Props
  const { ...restProps } = props;

  // Hooks
  const isSmallViewport = useIsSmallViewport();

  return (
    <AppPageContainer
      flexDir={isSmallViewport ? "column" : "row"}
      bg={"bg.canvas"}
      // p={2}
      {...restProps}
    >
      {!isSmallViewport && <Sidebar />}

      <Content />
    </AppPageContainer>
  );
};

const Content = () => {
  // Hooks
  const isSmallViewport = useIsSmallViewport();
  const pathname = useLocation().pathname;

  // Derived Values
  const panels = [
    { id: "map", minSize: isSmallViewport ? 5 : 5 },
    { id: "content", minSize: isSmallViewport ? 5 : "100px" },
  ];

  // Constants
  const navKey = getNavKeyFromPathname(APP_NAVS_MAP, pathname);
  const navTitle = navKey ? t[APP_NAVS_MAP[navKey].titleKey]() : "";

  // Components
  const contentPanel = (
    <Splitter.Panel key={"content"} id={"content"} alignItems={"end"}>
      <VStack minW={"400px"} w={"full"}>
        <HStack
          align={"center"}
          justify={"space-between"}
          minH={HEADER_H}
          maxH={HEADER_H}
          px={4}
        >
          {navTitle && <ClampedP fontWeight={"semibold"}>{navTitle}</ClampedP>}

          {/* <HStack align={"center"} ml={"auto"}>
            <IconButton variant={"subtle"} size={"2xs"} rounded={"full"}>
              <AppIcon icon={XIcon} size={"sm"} />
            </IconButton>
          </HStack> */}
        </HStack>

        <Outlet />
      </VStack>
    </Splitter.Panel>
  );
  const mapPanel = (
    <Splitter.Panel key={"map"} id={"map"}>
      <Center boxSize={"full"} textStyle={"2xl"} bg={"bg.success"}>
        Base map
      </Center>
    </Splitter.Panel>
  );
  const resizeTrigger = (
    <Splitter.ResizeTrigger
      key={"trigger"}
      id={isSmallViewport ? "map:content" : "content:map"}
    />
  );

  return (
    <Splitter.Root
      panels={panels}
      defaultSize={[50, 50]}
      orientation={isSmallViewport ? "vertical" : "horizontal"}
    >
      {isSmallViewport
        ? [mapPanel, resizeTrigger, contentPanel]
        : [contentPanel, resizeTrigger, mapPanel]}
    </Splitter.Root>
  );
};
// -------------------------------------------------------------------------------------

const Sidebar = () => {
  // Stores
  const expanded = useSidebarStore(
    (s) => s.expandedByKey[SIDE_BAR_KEY] ?? DEFAULT_SIDEBAR_EXPANDED,
  );

  return (
    <Box
      className={"group"}
      pos={"relative"}
      zIndex={10}
      w={expanded ? "300px" : `calc(40px + 24px)`}
      h={"full"}
      borderRight={"1px solid"}
      borderColor={"an1"}
      transition={"200ms cubic-bezier(0.175, 0.885, 0.32, 1.1)"}
    >
      <VStack
        overflowY={"auto"}
        overflowX={"clip"}
        h={"full"}
        bg={"bg.body"}
        // rounded={theme.radii.container}
      >
        <SidebarHeader />

        <Separator borderColor={"border.subtle"} mx={2} />

        <SidebarBody />

        <Separator borderColor={"border.subtle"} mx={2} />

        <SidebarFooter />
      </VStack>

      <ExpandToggleButton />
    </Box>
  );
};

const SidebarHeader = () => {
  // Stores
  const { theme } = useThemeStore();
  const expanded = useSidebarStore(
    (s) => s.expandedByKey[SIDE_BAR_KEY] ?? DEFAULT_SIDEBAR_EXPANDED,
  );

  return (
    <HStack
      align={"center"}
      justify={"space-between"}
      h={HEADER_H}
      p={4}
      w={"full"}
    >
      <HStack align={"center"} gap={1} ml={"-2px"}>
        {/* <Logo /> */}
        <AtrLogo boxSize={"36px"} minW={"36px"} />

        <ClampedP
          w={expanded ? "" : 0}
          fontWeight={"semibold"}
          color={`${theme.colorPalette}.fg`}
          lineHeight={1.2}
        >
          {APP.title}
        </ClampedP>
      </HStack>

      <ClampedP
        w={expanded ? "" : 0}
        mr={1}
        fontSize={"sm"}
        transition={"200ms"}
        color={"fg.subtle"}
        lineHeight={1}
      >
        v{APP.version}
      </ClampedP>
    </HStack>
  );
};

const SidebarBody = () => {
  // Stores
  const expanded = useSidebarStore(
    (s) => s.expandedByKey[SIDE_BAR_KEY] ?? DEFAULT_SIDEBAR_EXPANDED,
  );

  // Hooks
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const activeKey = getNavKeyFromPathname(APP_NAVS_MAP, pathname);

  return (
    <VNavs<AppNavKey>
      showTopBorderOnScroll={false}
      flex={1}
      groups={APP_NAV_GROUPS}
      navs={APP_NAVS_MAP}
      activeKey={activeKey}
      expanded={expanded}
      onNavClick={(key) => {
        navigate({
          to: APP_NAVS_MAP[key].pathname,
          resetScroll: false,
        });
      }}
      p={3}
    />
  );
};

const SidebarFooter = () => {
  // Stores
  const expanded = useSidebarStore(
    (s) => s.expandedByKey[SIDE_BAR_KEY] ?? DEFAULT_SIDEBAR_EXPANDED,
  );

  return (
    <VStack gap={1} p={3}>
      <NavButton>
        <AppIcon icon={BellIcon} />
        {expanded && t["common.notifications"]()}
      </NavButton>

      <NavLink to={APP_NAVS_MAP["help"].pathname}>
        <NavButton w={"full"}>
          <AppIcon icon={HelpCircleIcon} />
          {expanded && t["app.navs.help"]()}
        </NavButton>
      </NavLink>

      <NavButton>
        <AppIcon icon={UserIcon} />
        {expanded && t["common.profile"]()}
      </NavButton>
    </VStack>
  );
};

// -------------------------------------------------------------------------------------

const ExpandToggleButton = (props: IconButtonProps) => {
  // Stores
  const expanded = useSidebarStore(
    (s) => s.expandedByKey["app"] ?? DEFAULT_SIDEBAR_EXPANDED,
  );
  const toggleExpanded = useSidebarStore((s) => s.toggleExpanded);

  return (
    <Tooltip
      content={expanded ? t["action.collapse"]() : t["action.expand"]()}
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
        onClick={() => {
          toggleExpanded("app");
        }}
      >
        <IconButton
          variant={"blend"}
          size={"2xs"}
          minW={"16px"}
          w={"16px"}
          h={"80px"}
          color={"fg.muted"}
          rounded={"full"}
          border={"1px solid"}
          borderColor={"border.subtle"}
          transition={"200ms"}
          {...props}
        >
          <AppIcon
            icon={ChevronsRightIcon}
            size={"sm"}
            transform={expanded ? "rotate(180deg)" : ""}
          />
        </IconButton>
      </Center>
    </Tooltip>
  );
};
