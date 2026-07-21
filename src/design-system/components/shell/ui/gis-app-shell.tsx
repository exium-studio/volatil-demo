// src/design-system/components/shell/ui/gis-app-shell.tsx

import { Logo } from "@/design-system/components/branding/ui/logo";
import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PageContainer } from "@/design-system/components/layout/ui/page-container";
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
import { ChevronRightIcon } from "lucide-react";

const DEFAULT_SIDEBAR_EXPANDED = true;

export const GisAppShell = (props: GisAppShellProps) => {
  // Props
  const { ...restProps } = props;

  // Hooks
  const isSmallViewport = useIsSmallViewport();

  return (
    <PageContainer
      flexDir={isSmallViewport ? "column" : "row"}
      bg={"bg.canvas"}
      {...restProps}
    >
      <SideBar />

      <SettingsTrigger modalKey={"settings"} mt={"auto"}>
        <Button>Settings</Button>
      </SettingsTrigger>
      <Outlet />
    </PageContainer>
  );
};

const SideBar = () => {
  // Stores
  const expanded = useNavStore(
    (s) => s.expandedByKey["app"] ?? DEFAULT_SIDEBAR_EXPANDED,
  );

  // Hooks
  const navigate = useNavigate();

  return (
    <VStack
      className={"group"}
      pos={"relative"}
      w={expanded ? "240px" : `calc(40px + 24px)`}
      bg={"bg.body"}
      transition={"width 200ms"}
    >
      <ExpandToggleButton />

      {/* Header */}
      <HStack align={"center"} justify={"center"} h={HEADER_H} p={4}>
        <Logo />

        <ClampedP
          w={expanded ? "" : 0}
          ml={expanded ? 1 : 0}
          mr={1}
          fontSize={"lg"}
          fontWeight={"semibold"}
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
    </VStack>
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
      right={"-10px"}
      top={"50%"}
      zIndex={99}
      h={"50px"}
      border={"1px solid"}
      borderColor={"border.subtle"}
      rounded={"full"}
      opacity={0}
      transform={"translateY(-50%)"}
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
