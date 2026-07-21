// src/design-system/components/shell/ui/gis-app-shell.tsx

import { Logo } from "@/design-system/components/branding/ui/logo";
import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppPageContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
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
import { SettingsTrigger } from "@/features/settings/components/settings";
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
      {...restProps}
    >
      <SideBar />

      <SettingsTrigger modalKey={"settings"} mt={"auto"}>
        <Button>Settings</Button>
      </SettingsTrigger>

      <Outlet />
    </AppPageContainer>
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
      w={expanded ? "240px" : `calc(40px + 24px)`}
      transition={"width 200ms"}
      h={"full"}
      zIndex={10}
    >
      <VStack h={"full"} overflowY={"auto"} bg={"bg.body"} overflowX={"hidden"}>
        {/* Header */}
        <HStack
          align={"center"}
          justify={"space-between"}
          h={HEADER_H}
          p={4}
          w={"full"}
        >
          <HStack>
            <Logo ml={2} />

            <HStack align={"center"} gap={1}>
              <ClampedP
                w={expanded ? "" : 0}
                ml={3}
                mr={1}
                fontWeight={"semibold"}
                color={`${theme.colorPalette}.fg`}
                lineHeight={1.2}
              >
                {APP.title}
              </ClampedP>

              <ClampedP
                w={expanded ? "" : 0}
                fontSize={"sm"}
                transition={"200ms"}
                color={"fg.subtle"}
                lineHeight={1}
              >
                {APP.version}
              </ClampedP>
            </HStack>
          </HStack>

          {expanded && <ExpandToggleButton />}
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
          <NavButton>
            <AppIcon icon={HelpCircleIcon} />
            {expanded && t["app.nav.help"]()}
          </NavButton>

          <NavButton>
            <AppIcon icon={UserIcon} />
            {expanded && t["app.nav.profile"]()}
          </NavButton>
        </VStack>
      </VStack>

      {!expanded && (
        <ExpandToggleButton
          pos={"absolute"}
          right={"-13px"}
          top={`calc(${HEADER_H} - 18px)`}
          opacity={0}
          _groupHover={{ opacity: 1 }}
        />
      )}
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
        size={"xs"}
        zIndex={99}
        rounded={"full"}
        border={expanded ? "none" : "1px solid"}
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
          transform={expanded ? "rotate(180deg)" : ""}
        />
      </IconButton>
    </Tooltip>
  );
};
