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
import { VNavs } from "@/design-system/components/navigation/ui/v-navs";
import type { GisAppShellProps } from "@/design-system/components/shell/types/gis-app-shell.type";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { APP } from "@/design-system/constants/_meta";
import { HEADER_H } from "@/design-system/constants/styles";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { useNavStore } from "@/design-system/stores/use-nav-store";
import { SettingsTrigger } from "@/features/settings/components/settings";
import { APP_NAV_GROUPS } from "@/shared/constants/app.nav-groups.";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import type { AppNavKey } from "@/shared/types/app-navs.type";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { ChevronRightIcon, HelpCircleIcon, UserIcon } from "lucide-react";
import { Box } from "@chakra-ui/react";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { NavButton } from "@/design-system/components/navigation/ui/nav";
import { t } from "@/shared/libs/i18n";

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
          justify={"center"}
          h={HEADER_H}
          p={4}
          w={"full"}
        >
          <Logo />

          <ClampedP
            w={expanded ? "" : 0}
            ml={expanded ? 2 : 0}
            mr={1}
            fontSize={"lg"}
            fontWeight={"semibold"}
            transition={"200ms"}
            color={`${theme.colorPalette}.fg`}
          >
            {APP.title}
          </ClampedP>
        </HStack>

        {/* Nav items */}
        <VNavs<AppNavKey>
          groups={APP_NAV_GROUPS}
          navs={APP_NAVS_MAP}
          expanded={expanded}
          onNavClick={(key) => {
            navigate({
              to: APP_NAVS_MAP[key].href,
              resetScroll: false,
            });
          }}
          p={3}
        />

        <VStack
          gap={1}
          p={3}
          borderTop={"1px solid"}
          borderColor={"border.subtle"}
        >
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

      <ExpandToggleButton />
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
    <IconButton
      variant={"blend"}
      size={"2xs"}
      pos={"absolute"}
      right={"-13px"}
      top={`calc(${HEADER_H} - 13px)`}
      zIndex={99}
      minW={"26px"}
      h={"26px"}
      border={"1px solid"}
      borderColor={"border.subtle"}
      rounded={"full"}
      //   opacity={0}
      transition={"200ms"}
      _groupHover={{ opacity: 1 }}
      {...props}
      onClick={() => {
        toggleExpanded("app");
      }}
    >
      <AppIcon
        icon={ChevronRightIcon}
        transform={
          expanded ? "rotate(180deg) translateX(1px)" : "translateX(1px)"
        }
      />
    </IconButton>
  );
};
