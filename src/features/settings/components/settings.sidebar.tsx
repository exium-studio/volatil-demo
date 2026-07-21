// src/features/settings/components/settings.menu.tsx

"use client";

import { IconButton } from "@/design-system/components/button/ui/button";
import { ColorModeToggleButton } from "@/design-system/components/button/ui/color-mode-button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { VNavs } from "@/design-system/components/navigation/ui/v-navs";
import { P } from "@/design-system/components/typography/ui/p";
import { HEADER_H } from "@/design-system/constants/styles";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { SettingsSearchButton } from "@/features/settings/components/settings.search";
import { SETTINGS_NAV_GROUPS } from "@/features/settings/constants/settings.nav-groups";
import { SETTINGS_NAVS_MAP } from "@/features/settings/constants/settings.navs";
import type { SettingNavKey } from "@/features/settings/types/settings-navs.type";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";

export const SettingsSidebar = () => {
  // Hooks
  const isSmallViewport = useIsSmallViewport();

  return (
    <VStack
      className={"settings-menu"}
      overflowY={"auto"}
      minW={["full", null, "250px"]}
      bg={isSmallViewport ? "bg.canvas" : "bg.body"}
    >
      <SettingsSidebarHeader />

      <SettingsSidebarBody />
    </VStack>
  );
};

export const SettingsSidebarHeader = () => {
  // Hooks
  const isSmallViewport = useIsSmallViewport();

  return (
    <HStack
      className={"settings-menu__header"}
      align={"center"}
      justify={"space-between"}
      h={HEADER_H}
      p={2}
    >
      <HStack>
        {isSmallViewport && (
          <IconButton onClick={() => back()}>
            <AppIcon icon={ChevronLeftIcon} />
          </IconButton>
        )}

        {!isSmallViewport && <SettingsSearchButton />}
      </HStack>

      <P fontWeight={"semibold"} textAlign={"center"}>
        {t["common.settings"]()}
      </P>

      <HStack>
        {isSmallViewport && <SettingsSearchButton />}

        {!isSmallViewport && <ColorModeToggleButton />}
      </HStack>
    </HStack>
  );
};

export const SettingsSidebarBody = () => {
  // Hooks
  const { activeSettingNavKey } = useSearch({
    strict: false,
  });
  const navigate = useNavigate();
  const isSmallViewport = useIsSmallViewport();

  return (
    <VNavs<SettingNavKey>
      groups={SETTINGS_NAV_GROUPS}
      navs={SETTINGS_NAVS_MAP}
      activeKey={activeSettingNavKey}
      expanded={!isSmallViewport}
      onNavClick={(key) => {
        navigate({
          to: ".",
          resetScroll: false,
          replace: !!activeSettingNavKey,
          search: (old) => ({ ...old, activeSettingNavKey: key }),
        });
      }}
      gap={isSmallViewport ? 4 : 2}
      p={2}
    />
  );
};
