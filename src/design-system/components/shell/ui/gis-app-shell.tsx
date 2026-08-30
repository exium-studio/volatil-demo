// src/design-system/components/shell/ui/gis-app-shell.tsx

import { IgtLogo } from "@/design-system/components/branding/ui/igt-logo";
import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppPageContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Splitter } from "@/design-system/components/layout/ui/splitter";
import { useMapViewPadding } from "@/design-system/components/map/hooks/use-map-view-padding";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import {
  getWmsRasterConfigFromIgtLayer,
  type IgtLayerItem,
  type MapLayerConfig,
} from "@/design-system/components/map/types/map.type";
import { BaseMap, MapShell } from "@/design-system/components/map/ui/map";
import { NavLink } from "@/design-system/components/navigation/ui/link";
import { NavButton } from "@/design-system/components/navigation/ui/nav";
import { HNavs } from "@/design-system/components/navigation/ui/h-navs";
import { VNavs } from "@/design-system/components/navigation/ui/v-navs";
import { getNavKeyFromPathname } from "@/design-system/components/navigation/utils/v-navs.utils";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import type { GisAppShellProps } from "@/design-system/components/shell/types/gis-app-shell.type";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { APP_CONFIG } from "@/design-system/constants/_meta";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { useSidebarStore } from "@/design-system/stores/sidebar-store";
import { useSplitterStore } from "@/design-system/stores/splitter-store";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { UserProfilePopoverTrigger } from "@/features/auth/components/ui/user-profile-popover";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { DEFAULT_ACTIVE_IGT_LAYER_ID } from "@/features/mitra/data-request/constants/igt.config";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import {
  APP_NAV_GROUPS_LIST,
  APP_OTHER_NAV_GROUPS_LIST,
  INTERNAL_APP_NAV_GROUPS_LIST,
  INTERNAL_APP_OTHER_NAV_GROUPS_LIST,
} from "@/shared/constants/app.nav-groups";
import {
  APP_NAVS_MAP,
  INTERNAL_APP_NAVS_MAP,
} from "@/shared/constants/app.navs";
import { t } from "@/shared/libs/i18n";
import type { AdminAppNavKey, AppNavKey } from "@/shared/types/app-navs.type";
import type { NavGroup, NavItem } from "@/shared/types/nav.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { getUserSession } from "@/shared/utils/user/user-session.utils";
import { Box } from "@chakra-ui/react";
import {
  IconChevronCompactLeft,
  IconChevronCompactRight,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { UserIcon } from "lucide-react";
import { useMemo, useRef } from "react";

// -------------------------------------------------------------------------------------

const DEFAULT_SIDEBAR_EXPANDED = false;
const SIDE_BAR_KEY = "gis-app";
const DEFAULT_SPLITTER_SIZE = [50, 50];
const SPLITTER_KEY = "gis-app";

export const GisAppShell = (props: GisAppShellProps) => {
  // Props
  const { ...restProps } = props;

  // Hooks
  const isSmallViewport = useIsSmallViewport();

  return (
    <AppPageContainer
      flexDir={isSmallViewport ? "column" : "row"}
      pos={"relative"}
      overflow={"hidden"}
      bg={"bg.canvas"}
      {...restProps}
    >
      {!isSmallViewport && <Sidebar />}

      <Content />

      {isSmallViewport && <MobileBottomNav />}
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
      w={expanded ? "240px" : `calc(40px + 24px)`}
      h={"full"}
      transition={"200ms"}
      // transition={"200ms cubic-bezier(0.175, 0.885, 0.32, 1.1)"}
    >
      <VStack
        overflowY={"auto"}
        overflowX={"clip"}
        h={"full"}
        py={2}
        bg={"bg.body"}
        borderRight={"1px solid"}
        borderColor={"bg.canvas"}
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
      h={"headerH"}
      p={4}
      w={"full"}
    >
      <NavLink to={"/"}>
        <HStack align={"center"} gap={"sm"}>
          <IgtLogo boxSize={"24px"} ml={1} />

          <ClampedP
            w={expanded ? "" : 0}
            fontWeight={"semibold"}
            color={`${theme.colorPalette}.fg`}
            lineHeight={1.2}
          >
            {APP_CONFIG.title}
          </ClampedP>
        </HStack>
      </NavLink>

      <ClampedP
        w={expanded ? "" : 0}
        mr={1}
        fontSize={"sm"}
        transition={"200ms"}
        color={"fg.subtle"}
        lineHeight={1}
      >
        v{APP_CONFIG.version}
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
  const userData = getUserSession();
  const role = userData?.role ?? "mitra";
  const navsMap = (role === "internal"
    ? INTERNAL_APP_NAVS_MAP
    : APP_NAVS_MAP) as unknown as Record<AdminAppNavKey | AppNavKey, NavItem>;
  const navGroups =
    role === "internal" ? INTERNAL_APP_NAV_GROUPS_LIST : APP_NAV_GROUPS_LIST;
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

  // Hooks
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  // Derived Values
  const userData = getUserSession();
  const role = userData?.role ?? "mitra";
  const navsMap = (role === "internal"
    ? INTERNAL_APP_NAVS_MAP
    : APP_NAVS_MAP) as unknown as Record<AdminAppNavKey | AppNavKey, NavItem>;
  const otherNavGroups: NavGroup<AdminAppNavKey | AppNavKey>[] =
    role === "internal"
      ? INTERNAL_APP_OTHER_NAV_GROUPS_LIST
      : APP_OTHER_NAV_GROUPS_LIST;
  const activeKey = getNavKeyFromPathname(navsMap, pathname);

  return (
    <VStack gap={1} p={3}>
      <VNavs
        showTopBorderOnScroll={false}
        groups={otherNavGroups}
        navs={navsMap}
        activeKey={activeKey}
        expanded={expanded}
        onNavClick={(key) => {
          navigate({
            to: navsMap[key].pathname,
            resetScroll: false,
          });
        }}
      />

      <UserProfilePopoverTrigger>
        <NavButton
          aria-label={t["app.navs.profile"]()}
          variant={"ghost"}
          w={expanded ? "full" : undefined}
        >
          <AppIcon icon={UserIcon} color={"fg.muted"} />

          {expanded && t["app.navs.profile"]()}
        </NavButton>
      </UserProfilePopoverTrigger>
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

const SIDEBAR_COLLAPSED_W = 64;
const SIDEBAR_EXPANDED_W = 300;

const Content = () => {
  // Refs
  const contentPanelRef = useRef<HTMLDivElement | null>(null);

  // Stores
  const splitterSize = useSplitterStore(
    (s) => s.sizesByKey[SPLITTER_KEY] ?? DEFAULT_SPLITTER_SIZE,
  );
  const setSplitterSize = useSplitterStore((s) => s.setSize);
  const wmsVisible = useMapLayerStore((s) => s.wmsVisible);
  const sidebarExpanded = useSidebarStore(
    (s) => s.expandedByKey[SIDE_BAR_KEY] ?? DEFAULT_SIDEBAR_EXPANDED,
  );
  const map = useMapInstanceStore((state) => state.map);

  // Hooks
  const isSmallViewport = useIsSmallViewport();
  const pathname = useLocation().pathname;

  // Derived Values — Build layer config from fetched layer list
  const { data: fetchedLayers } = useQuery({
    queryKey: queryKeys.map.layers(),
    queryFn: ({ signal }) => getIgtLayers(signal),
    staleTime: 1000 * 60 * 5,
  });

  const { enabledLayerIds, layerOpacities, cqlFilter } = useIgtLayerStore();

  const userData = getUserSession();
  const role = userData?.role ?? "mitra";
  const isInternal = role === "internal";
  const isDataManagementPage = pathname.includes("/internal/data-management");

  const mapLayers = useMemo<MapLayerConfig[]>(() => {
    // For internal admin, only render IGT layers if currently on data-management page
    if (isInternal && !isDataManagementPage) {
      return [];
    }

    const rawList = fetchedLayers?.items ?? fetchedLayers?.layers ?? [];
    const sorted = [...rawList].sort(
      (a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0),
    );
    return sorted.map((layer: IgtLayerItem) => {
      const isEnabled =
        enabledLayerIds[layer.id] ??
        (isInternal ? false : layer.id === DEFAULT_ACTIVE_IGT_LAYER_ID);
      const opacity = layerOpacities[layer.id] ?? 1.0;
      return getWmsRasterConfigFromIgtLayer(
        layer,
        wmsVisible && isEnabled,
        opacity,
      );
    });
  }, [
    fetchedLayers,
    wmsVisible,
    enabledLayerIds,
    layerOpacities,
    isInternal,
    isDataManagementPage,
  ]);

  // Derived Values
  const sidebarPx = sidebarExpanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  const panels = [
    { id: "content", minSize: 5 },
    { id: "spacer", minSize: 5 },
  ];

  // Sync map padding — ResizeObserver inside hook handles splitter drag,
  // sidebar toggle triggers a smooth animated transition
  useMapViewPadding(map, {
    contentPanelRef,
    sidebarPx,
    isVertical: isSmallViewport,
  });

  const contentPanel = (
    <Splitter.Panel
      key={"content"}
      id={"content"}
      alignItems={"end"}
      overflow={"auto"}
    >
      <VStack
        ref={contentPanelRef}
        flex={1}
        overflow={"auto"}
        minW={[0, null, "360px"]}
        w={"full"}
        minH={"300px"}
        bg={"bg.canvas"}
        shadow={"md"}
        pointerEvents={"auto"}
      >
        <Outlet />
      </VStack>
    </Splitter.Panel>
  );

  // Right Splitter panel — holds MapShell (MapOverlay controls, layer management, draw toolbar)
  const spacerPanel = (
    <Splitter.Panel key={"spacer"} id={"spacer"} pointerEvents={"none"}>
      <Box pos={"relative"} boxSize={"full"} pointerEvents={"none"}>
        <MapShell
          layers={mapLayers}
          cqlFilter={cqlFilter}
          showIgtLayerSelect={!isInternal}
          onDrawFinish={(feature, originalPoints) => {
            console.log("draw finished", { feature, originalPoints });
          }}
        />
      </Box>
    </Splitter.Panel>
  );

  const resizeTrigger = (
    <Splitter.ResizeTrigger
      key={"trigger"}
      id={isSmallViewport ? "spacer:content" : "content:spacer"}
      pointerEvents={"auto"}
      onDoubleClick={() => {
        setSplitterSize(SPLITTER_KEY, DEFAULT_SPLITTER_SIZE);
      }}
    />
  );

  return (
    <>
      {/* Full-viewport basemap tile layer — sits behind everything */}
      <Box pos={"fixed"} top={0} left={0} right={0} bottom={0} zIndex={0}>
        <BaseMap />
      </Box>

      {/* Splitter — content panel + transparent spacer (no map inside) */}
      <Splitter.Root
        flex={1}
        panels={panels}
        size={splitterSize}
        onResize={(details) => {
          setSplitterSize(SPLITTER_KEY, details.size);
        }}
        orientation={isSmallViewport ? "vertical" : "horizontal"}
        pos={"relative"}
        zIndex={1}
        pointerEvents={"none"}
      >
        {isSmallViewport
          ? [spacerPanel, resizeTrigger, contentPanel]
          : [contentPanel, resizeTrigger, spacerPanel]}
      </Splitter.Root>
    </>
  );
};

// -------------------------------------------------------------------------------------

const MobileBottomNav = () => {
  // Stores

  // Hooks
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  // Derived Values
  const userData = getUserSession();
  const role = userData?.role ?? "mitra";
  const navsMap = (role === "internal"
    ? INTERNAL_APP_NAVS_MAP
    : APP_NAVS_MAP) as unknown as Record<AdminAppNavKey | AppNavKey, NavItem>;
  const mainGroups =
    role === "internal" ? INTERNAL_APP_NAV_GROUPS_LIST : APP_NAV_GROUPS_LIST;
  const otherGroups =
    role === "internal"
      ? INTERNAL_APP_OTHER_NAV_GROUPS_LIST
      : APP_OTHER_NAV_GROUPS_LIST;

  const allNavKeys = useMemo(() => {
    const mainKeys = mainGroups.flatMap((g) => g.items.map((i) => i.key));
    const otherKeys = otherGroups.flatMap((g) => g.items.map((i) => i.key));
    return [...mainKeys, ...otherKeys];
  }, [mainGroups, otherGroups]);

  const activeKey = getNavKeyFromPathname(navsMap, pathname);

  return (
    <HStack
      w={"full"}
      bg={"bg.body"}
      borderTop={"1px solid"}
      borderColor={"border.subtle"}
      p={"sm"}
      pb={"md"}
      align={"center"}
      zIndex={2}
      pointerEvents={"auto"}
      flexShrink={0}
    >
      <Box flex={1} minW={0} overflow={"hidden"}>
        <HNavs<AdminAppNavKey | AppNavKey>
          navs={navsMap}
          navKeys={allNavKeys}
          activeKey={activeKey}
          onNavClick={(key) => {
            const target = navsMap[key];
            if (target?.pathname) {
              navigate({
                to: target.pathname,
                resetScroll: false,
              });
            }
          }}
        />
      </Box>

      <Separator
        orientation={"vertical"}
        h={"52px"}
        borderColor={"border.subtle"}
      />

      <UserProfilePopoverTrigger>
        <NavButton
          aria-label={t["app.navs.profile"]()}
          variant={"ghost"}
          size={"sm"}
          h={"auto"}
          p={"xs"}
          ml={"xs"}
          flexShrink={0}
        >
          <VStack gap={"2xs"} align={"center"} justify={"center"}>
            <AppIcon icon={UserIcon} color={"fg.muted"} />

            <ClampedP
              fontSize={"2xs"}
              fontWeight={"medium"}
              color={"fg.muted"}
              textAlign={"center"}
              lineHeight={"normal"}
              pb={"1px"}
            >
              {t["app.navs.profile"]()}
            </ClampedP>
          </VStack>
        </NavButton>
      </UserProfilePopoverTrigger>
    </HStack>
  );
};
