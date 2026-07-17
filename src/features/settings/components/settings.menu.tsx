// src/features/settings/components/settings.menu.tsx

"use client";

import { IconButton } from "@/design-system/components/button/ui/button";
import { ColorModeToggleButton } from "@/design-system/components/button/ui/color-mode-button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { NavButton } from "@/design-system/components/layout/ui/nav";
import { VScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { HEADER_H } from "@/design-system/constants/styles";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { SettingsSearchButton } from "@/features/settings/components/settings.search";
import { SETTINGS_NAV_GROUPS } from "@/features/settings/constants/settings.nav-groups";
import { SETTINGS_NAVS } from "@/features/settings/constants/settings.navs";
import type { SettingNav } from "@/features/settings/types/settings-navs.type";
import { RootRoute } from "@/routes/-typed";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import { Fragment } from "react/jsx-runtime";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export const SettingsMenu = () => {
  // Hooks
  const isSmallViewport = useIsSmallViewport();

  return (
    <VStack
      className={"settings-menu"}
      overflowY={"auto"}
      minW={["full", null, "250px"]}
      bg={isSmallViewport ? "bg.canvas" : "bg.body"}
    >
      <SettingsMenuHeader />

      <SettingsMenuBody p={2} />
    </VStack>
  );
};

export const SettingsMenuHeader = () => {
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

export const SettingsMenuBody = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const { activeSettingNavKey } = RootRoute.useSearch();
  const navigate = RootRoute.useNavigate();
  const isSmallViewport = useIsSmallViewport();

  return (
    <VScrollContainer gap={isSmallViewport ? 4 : 2} {...restProps}>
      {SETTINGS_NAV_GROUPS.map((group, index) => {
        const isFirstIndex = index === 0;
        const groupTitle = group?.titleKey
          ? t[group.titleKey]()
          : group.titleKey;

        return (
          <Fragment key={index}>
            {!isSmallViewport && !isFirstIndex && <Separator />}

            <VStack>
              {groupTitle && (
                <P fontSize={"xs"} color={"fg.subtle"} px={2} mb={2}>
                  {groupTitle}
                </P>
              )}

              <VStack
                gap={isSmallViewport ? 0 : 1}
                overflow={"clip"}
                bg={"bg.body"}
                rounded={theme.radii.container}
              >
                {group.list.map((navKey, itemIndex) => {
                  const isNavActive = activeSettingNavKey === navKey;
                  const isItemFirstIndex = itemIndex === 0;
                  const nav = SETTINGS_NAVS[navKey] as SettingNav;
                  const navTitle = nav?.titleKey
                    ? t[nav.titleKey]()
                    : nav.titleKey;

                  return (
                    <Fragment key={navKey}>
                      {!isItemFirstIndex && isSmallViewport && (
                        <Separator borderColor={"bg.canvas"} />
                      )}

                      <NavButton
                        size={"lg"}
                        variant={isNavActive ? "subtle" : "ghost"}
                        pl={3}
                        rounded={isSmallViewport ? "none" : "inherit"}
                        onClick={() => {
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              activeSettingNavKey: navKey,
                            }),
                            replace: !!activeSettingNavKey,
                          });
                        }}
                      >
                        {nav.icon && <AppIcon icon={nav.icon} />}

                        {navTitle}

                        {isSmallViewport && (
                          <AppIcon
                            icon={ChevronRightIcon}
                            color={"fg.subtle"}
                            ml={"auto"}
                          />
                        )}
                      </NavButton>
                    </Fragment>
                  );
                })}
              </VStack>
            </VStack>
          </Fragment>
        );
      })}
    </VScrollContainer>
  );
};
