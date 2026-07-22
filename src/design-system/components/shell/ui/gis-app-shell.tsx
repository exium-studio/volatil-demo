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
import { useNavStore } from "@/design-system/stores/use-nav-store";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { APP_NAV_GROUPS } from "@/shared/constants/app.nav-groups.";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { t } from "@/shared/libs/i18n";
import type { AppNavKey } from "@/shared/types/app-navs.type";
import { Box } from "@chakra-ui/react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { ChevronsRightIcon, HelpCircleIcon, UserIcon } from "lucide-react";

const DEFAULT_SIDEBAR_EXPANDED = true;

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
      <SideBar />

      <MainContent />
    </AppPageContainer>
  );
};

const MainContent = () => {
  // Hooks
  const isSmallViewport = useIsSmallViewport();

  return (
    <Splitter.Root
      panels={[
        { id: "a", minSize: 30 },
        { id: "b", minSize: 30 },
      ]}
      defaultSize={[50, 50]}
      orientation={isSmallViewport ? "vertical" : "horizontal"}
      minH={"60"}
    >
      <Splitter.Panel id={"a"} bg={"bg.body"}>
        <Outlet />
      </Splitter.Panel>

      <Splitter.ResizeTrigger id={"a:b"} />

      <Splitter.Panel id={"b"}>
        <Center boxSize={"full"} textStyle={"2xl"}>
          Base map
        </Center>
      </Splitter.Panel>
    </Splitter.Root>
  );
};

const SideBar = () => {
  // Stores
  const { theme } = useThemeStore();
  const expanded = useNavStore(
    (s) => s.expandedByKey["app"] ?? DEFAULT_SIDEBAR_EXPANDED,
  );

  // Hooks
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const activeKey = getNavKeyFromPathname(APP_NAVS_MAP, pathname);

  return (
    <Box
      className={"group"}
      pos={"relative"}
      zIndex={10}
      w={expanded ? "240px" : `calc(40px + 24px)`}
      h={"full"}
      transition={"2000ms cubic-bezier(0.175, 0.885, 0.32, 1.1)"}
    >
      <VStack
        overflowY={"auto"}
        overflowX={"clip"}
        h={"full"}
        bg={"bg.body"}
        // rounded={theme.radii.container}
      >
        {/* Header */}
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

          {/* {expanded && <ExpandToggleButton />} */}
        </HStack>

        <Separator borderColor={"border.subtle"} mx={2} />

        {/* Nav items */}
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

        <Separator borderColor={"border.subtle"} mx={2} />

        <VStack gap={1} p={3}>
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
      </VStack>

      <ExpandToggleButton
        pos={"absolute"}
        right={"-13px"}
        top={"16px"}
        opacity={0}
        _groupHover={{ opacity: 1 }}
      />
    </Box>
  );
};

const ExpandToggleButton = (props: IconButtonProps) => {
  // Stores
  const expanded = useNavStore(
    (s) => s.expandedByKey["app"] ?? DEFAULT_SIDEBAR_EXPANDED,
  );
  const toggleExpanded = useNavStore((s) => s.toggleExpanded);

  return (
    <Tooltip content={expanded ? t["action.collapse"]() : t["action.expand"]()}>
      <IconButton
        variant={"blend"}
        size={"2xs"}
        zIndex={99}
        rounded={"full"}
        border={"1px solid"}
        borderColor={"border.subtle"}
        color={"fg.muted"}
        transition={"200ms"}
        {...props}
        onClick={() => {
          toggleExpanded("app");
        }}
      >
        <AppIcon
          icon={ChevronsRightIcon}
          size={"sm"}
          transform={expanded ? "rotate(180deg)" : ""}
        />
      </IconButton>
    </Tooltip>
  );
};
