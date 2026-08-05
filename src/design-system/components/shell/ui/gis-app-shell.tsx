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
import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";
import { BaseMap } from "@/design-system/components/map/ui/map.basemap";
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
import { useSplitterStore } from "@/design-system/stores/use-splitter-store";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import {
  ADMIN_APP_NAV_GROUPS,
  ADMIN_APP_OTHER_NAV_GROUPS,
  APP_NAV_GROUPS,
  APP_OTHER_NAV_GROUPS,
} from "@/shared/constants/app.nav-groups.";
import { ADMIN_APP_NAVS_MAP, APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { t } from "@/shared/libs/i18n";
import type { AdminAppNavKey, AppNavKey } from "@/shared/types/app-navs.type";
import type { NavGroup, NavItem } from "@/shared/types/nav.type";
import { Box } from "@chakra-ui/react";
import {
  IconChevronCompactLeft,
  IconChevronCompactRight,
} from "@tabler/icons-react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { UserIcon } from "lucide-react";

// -------------------------------------------------------------------------------------

// TODO: replace with real WFS/raster/vector layer config once endpoints are ready
const MAP_LAYERS: MapLayerConfig[] = [];

const DEFAULT_SIDEBAR_EXPANDED = true;
const SIDE_BAR_KEY = "gis-app";
const DEFAULT_SPLITTER_SIZE = [50, 50];
const SPLITTER_KEY = "gis-app";

// TODO: get user data from local storage
const user = {
  // role: "user",
  role: "admin",
};

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
      borderColor={"border"}
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

        <Separator mx={2} />

        <SidebarBody />

        <Separator mx={2} />

        <SidebarFooter />
      </VStack>

      <SidebarToggleButton />
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
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  // Derived Values
  const navsMap = (user.role === "admin"
    ? ADMIN_APP_NAVS_MAP
    : APP_NAVS_MAP) as unknown as Record<AdminAppNavKey | AppNavKey, NavItem>;
  const navGroups =
    user.role === "admin" ? ADMIN_APP_NAV_GROUPS : APP_NAV_GROUPS;
  const activeKey = getNavKeyFromPathname(navsMap, pathname);

  return (
    <VNavs
      showTopBorderOnScroll={false}
      flex={1}
      groups={navGroups}
      navs={navsMap}
      activeKey={activeKey}
      expanded={expanded}
      onNavClick={(key) => {
        navigate({
          to: navsMap[key].pathname,
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

  // Derived Values
  const navsMap = (user.role === "admin"
    ? ADMIN_APP_NAVS_MAP
    : APP_NAVS_MAP) as unknown as Record<AdminAppNavKey | AppNavKey, NavItem>;
  const otherNavGroups: NavGroup<AdminAppNavKey | AppNavKey>[] =
    user.role === "admin" ? ADMIN_APP_OTHER_NAV_GROUPS : APP_OTHER_NAV_GROUPS;

  return (
    <VStack gap={1} p={3}>
      <VStack gap={1}>
        {otherNavGroups.map((navGroup, index) => {
          return (
            <VStack key={navGroup.titleKey ?? index}>
              {navGroup.items.map((item) => {
                const nav = navsMap[item.key];

                return (
                  <NavLink key={item.key} to={nav.pathname}>
                    <NavButton>
                      <AppIcon icon={nav.icon} />
                      {expanded && t[nav.titleKey]()}
                    </NavButton>
                  </NavLink>
                );
              })}
            </VStack>
          );
        })}

        <NavButton>
          <AppIcon icon={UserIcon} />
          {expanded && t["app.navs.profile"]()}
        </NavButton>
      </VStack>
    </VStack>
  );
};

const SidebarToggleButton = (props: IconButtonProps) => {
  // Stores
  const expanded = useSidebarStore(
    (s) => s.expandedByKey[SIDE_BAR_KEY] ?? DEFAULT_SIDEBAR_EXPANDED,
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
        transition={"200ms"}
        onClick={() => {
          toggleExpanded(SIDE_BAR_KEY);
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
          {...props}
        >
          <AppIcon
            icon={expanded ? IconChevronCompactLeft : IconChevronCompactRight}
            size={"sm"}
          />
        </IconButton>
      </Center>
    </Tooltip>
  );
};

// -------------------------------------------------------------------------------------

const Content = () => {
  // Stores
  const splitterSize = useSplitterStore(
    (s) => s.sizesByKey[SPLITTER_KEY] ?? DEFAULT_SPLITTER_SIZE,
  );
  const setSplitterSize = useSplitterStore((s) => s.setSize);

  // Hooks
  const isSmallViewport = useIsSmallViewport();

  // Derived Values
  const panels = [
    { id: "map", minSize: isSmallViewport ? 5 : 5 },
    { id: "content", minSize: isSmallViewport ? 5 : 5 },
  ];

  // Components
  const contentPanel = (
    <Splitter.Panel
      key={"content"}
      id={"content"}
      alignItems={"end"}
      overflow={"auto"}
    >
      <VStack
        flex={1}
        overflow={"auto"}
        minW={[0, null, "360px"]}
        w={"full"}
        minH={"300px"}
      >
        <Outlet />
      </VStack>
    </Splitter.Panel>
  );
  const mapPanel = (
    <Splitter.Panel key={"map"} id={"map"}>
      <Box
        pos={"relative"}
        minW={[0, null, "360px"]}
        boxSize={"full"}
        bgImage={[
          "radial-gradient(1px 1px at 25px 35px, #fff 50%, transparent)",
          "radial-gradient(1.5px 1.5px at 60px 120px, rgba(255, 255, 255, 0.6) 50%, transparent)",
          "radial-gradient(1px 1px at 150px 75px, #fff 50%, transparent)",
          "radial-gradient(2px 2px at 280px 220px, rgba(255, 255, 255, 0.4) 50%, transparent)",
          "radial-gradient(circle at 50% 50%, #1d1d1d 0%, #181818 60%, #151515 100%)",
        ].join(", ")}
        bgSize={"200px 200px, 250px 250px, 300px 300px, 350px 350px, 100% 100%"}
        borderLeft={!isSmallViewport ? "1px solid" : undefined}
        borderColor={"border"}
      >
        <BaseMap
          layers={MAP_LAYERS}
          onDrawFinish={(feature, originalPoints) => {
            console.log({ feature, originalPoints });
            // TODO: handle the finished polygon (e.g. push into form state or send to API)
          }}
        />
      </Box>
    </Splitter.Panel>
  );
  const resizeTrigger = (
    <Splitter.ResizeTrigger
      key={"trigger"}
      id={isSmallViewport ? "map:content" : "content:map"}
      onDoubleClick={() => {
        setSplitterSize(SPLITTER_KEY, DEFAULT_SPLITTER_SIZE);
      }}
    />
  );

  return (
    <Splitter.Root
      panels={panels}
      size={splitterSize}
      onResize={(details) => {
        setSplitterSize(SPLITTER_KEY, details.size);
      }}
      orientation={isSmallViewport ? "vertical" : "horizontal"}
    >
      {isSmallViewport
        ? [mapPanel, resizeTrigger, contentPanel]
        : [contentPanel, resizeTrigger, mapPanel]}
    </Splitter.Root>
  );
};
